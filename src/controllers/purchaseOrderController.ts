import { FastifyReply, FastifyRequest } from 'fastify'
import { areProductsValid, generateReference, getCommonFilter, PO_REF_PREFIX } from '../utils'
import { Prisma } from '@prisma/client'
import { globalPrisma } from '../app'
import {
	createPORows,
	deletePOHeader,
	deletePORows,
	getPOHeader,
	getSupplier,
	getUser,
	updatePOHeader,
} from '../utils/db.utils'

export const POListController = async (request: FastifyRequest<{ Querystring: TPOListQueryType }>, reply: FastifyReply) => {
	try {
		const {
			pageSize,
			current,
			orderBy,
			orderField,
			search = '',
			approval_status,
			supplier_id,
			created_by,
		} = request?.query
		const args = {
			...getCommonFilter({ pageSize, current, orderBy, orderField }),
			where: {
				approval_status,
				supplier_id,
				created_by,
				OR: [{ reference_number: { contains: search, mode: 'insensitive' } }],
			} as Prisma.purchase_order_headerWhereInput,
			include: { supplierId: { select: { name: true } }, createdBy: { select: { username: true } } },
		}
		const [data, total] = await Promise.all([
			globalPrisma.purchase_order_header.findMany(args),
			globalPrisma.purchase_order_header.count({ where: args.where }),
		])

		const pageInfo = { pageSize, current, total }
		return reply.code(200).send({ data, pageInfo })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

// PO details by using PO header id
export const PODetailsController = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
	try {
		const { id } = request.params
		const header = await globalPrisma.purchase_order_header.findFirst({
			where: { id },
			include: {
				supplierId: true,
				createdBy: { select: { username: true, contact: true } },
				purchase_order_row: { include: { productId: { select: { price: true } } } },
			},
		})
		if (!header) {
			return reply.code(404).send({ message: 'Purchase Order not found' })
		}
		const { purchase_order_row = [], ...purchase_order_header } = { ...(header ?? {}) }
		const rows = purchase_order_row.map((item) => ({
			...item,
			quantity_price: item.productId?.price,
		}))

		return reply.code(200).send({ data: { header: purchase_order_header, rows } })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const POCreateController = async (request: FastifyRequest<{ Body: TPOCreateUpdatePayload }>, reply: FastifyReply) => {
	try {
		const { header, rows } = { ...(request.body ?? {}) }
		console.log({ rows })
		// check the supplier and user is exist or not
		const [user, supplier] = await Promise.all([getUser(header.created_by), getSupplier(header.supplier_id)])
		const userInvalid = !user || !supplier || user.userType.name === 'SALES_STAFF'
		if (userInvalid) {
			return reply.code(404).send({ message: 'User or Supplier invalid' })
		}
		const [validProducts, missingProductNames] = await areProductsValid(rows)
		if (!validProducts) {
			return reply.code(404).send({ message: `Products not found: ${missingProductNames.join(', ')}` })
		}

		const POHeader = await globalPrisma.purchase_order_header.create({
			data: { ...header, reference_number: generateReference(PO_REF_PREFIX), approval_status: 'PENDING' },
		})

		await createPORows(rows, POHeader.id)
		return reply.code(200).send({ message: 'Purchase Order created successfully' })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const POUpdateController = async (
	request: FastifyRequest<{ Body: TPOCreateUpdatePayload; Params: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params
		const { header, rows } = { ...(request.body ?? {}) }
		const [userId, userType] = [request.user.id, request.user.userType.name as TUserTypes]

		// check the supplier and user is exist or not
		const [user, supplier] = await Promise.all([getUser(header.created_by), getSupplier(header.supplier_id)])
		if (!user || !supplier) {
			return reply.code(404).send({ message: 'User or Supplier not found' })
		}

		const thePOHeader = await getPOHeader(id)
		if (!thePOHeader || (thePOHeader?.created_by !== userId && userType !== 'ADMIN')) {
			return reply.code(400).send({ message: 'You are not authorized to update this Purchase Order' })
		}
		if (thePOHeader?.approval_status !== 'PENDING') {
			return reply.code(400).send({ message: 'Purchase Order cannot be updated after it is approved or rejected' })
		}

		const [validProducts, missingProductNames] = await areProductsValid(rows)
		if (!validProducts) {
			return reply.code(404).send({ message: `Products not found: ${missingProductNames.join(', ')}` })
		}

		await Promise.all([updatePOHeader(id, header), deletePORows(id)])
		await createPORows(rows, id)
		return reply.code(200).send({ message: 'Purchase Order updated successfully' })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const PODeleteController = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
	try {
		const [userId, userType] = [request.user.id, request.user.userType.name as TUserTypes]
		const { id } = request.params
		const thePOHeader = await getPOHeader(id)
		if (!(thePOHeader?.created_by === userId || userType === 'ADMIN')) {
			throw new Error('You are not authorized to delete this Purchase Order')
		}
		if (thePOHeader?.approval_status !== 'PENDING') {
			throw new Error('Purchase Order cannot be deleted after it is approved or rejected')
		}
		await deletePORows(id)
		await deletePOHeader(id)
		return reply.code(200).send({ message: 'Purchase Order deleted successfully' })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const approvePOController = async (
	request: FastifyRequest<{ Body: TPOApproveBody; Params: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params
		const { isApprove } = request.body
		// check is po exist
		const thePOHeader = await getPOHeader(id)
		if (!thePOHeader || thePOHeader.approval_status !== 'PENDING') {
			throw new Error('Invalid Purchase Order')
		}

		await globalPrisma.purchase_order_header.update({
			where: { id },
			data: { approval_status: isApprove ? 'APPROVED' : 'REJECTED' },
		})

		if (isApprove) {
			const poRows = await globalPrisma.purchase_order_row.findMany({ where: { header_id: id } })
			await Promise.all([
				...poRows.map(({ product_id, quantity }) =>
					globalPrisma.inventory_stock.upsert({
						where: { product_id },
						update: { quantity: { increment: quantity } },
						create: { product_id, quantity },
					})
				),
				globalPrisma.inventory_transaction.createMany({
					data: poRows.map(({ product_id, product_name, quantity }) => ({
						type: 'IN',
						product_id,
						product_name,
						transaction_quantity: quantity,
					})),
				}),
			])
		}

		return reply.code(200).send({ message: `Purchase-Order ${isApprove ? `approved` : `rejected`} successfully` })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}
