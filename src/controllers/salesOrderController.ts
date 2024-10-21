import { FastifyReply, FastifyRequest } from 'fastify'
import { globalPrisma } from '../app'
import { areProductsQuantityValid, generateReference, getCommonFilter, SO_REF_PREFIX } from '../utils'
import { Prisma } from '@prisma/client'
import { createSORows, deleteSOHeader, deleteSORows, getSOHeader, getUser, updateSOHeader } from '../utils/db.utils'

export const getSOListController = async (
	request: FastifyRequest<{ Querystring: TSOListQueryType }>,
	reply: FastifyReply
) => {
	try {
		const {
			pageSize,
			current,
			approval_status,
			orderBy,
			orderField,
			search = '',
			created_by,
			customer_name,
		} = request?.query
		const args = {
			...getCommonFilter({ pageSize, current, orderBy, orderField }),
			where: {
				approval_status,
				created_by,
				customer_name,
				OR: [{ reference_number: { contains: search } }],
			} as Prisma.sales_order_headerWhereInput,
		}
		const [data, total] = await Promise.all([
			globalPrisma.sales_order_header.findMany(args),
			globalPrisma.sales_order_header.count({ where: args.where }),
		])
		const pageInfo = { pageSize, current, total }
		return reply.code(200).send({ data, pageInfo })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

// SO details by using SO header id
export const SODetailsController = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
	try {
		const { id } = request.params
		const header = await globalPrisma.sales_order_header.findFirst({
			where: { id },
			include: {
				createdBy: { select: { username: true, contact: true } },
				sales_order_row: { include: { productId: { select: { price: true } } } },
			},
		})
		if (!header) {
			return reply.code(404).send({ message: 'Sales Order not found' })
		}
		const { sales_order_row = [], ...sales_order_header } = { ...(header ?? {}) }
		const rows = sales_order_row.map((item) => ({
			...item,
			quantity_price: item.productId?.price,
		}))

		return reply.code(200).send({ data: { header: sales_order_header, rows } })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const salesOrderCreateController = async (
	request: FastifyRequest<{ Body: TSOCreateUpdatePayload }>,
	reply: FastifyReply
) => {
	try {
		const { header, rows } = request.body
		// check the  user is exist or not
		const user = await getUser(header.created_by)
		const invalidUser = !user || user.userType.name === 'WAREHOUSE_STAFF'
		if (invalidUser) {
			return reply.code(404).send({ message: 'User invalid' })
		}
		// check product quantity validation
		const [areValid, lessQuantityProducts] = await areProductsQuantityValid(rows)
		if (!areValid) {
			return reply.code(400).send({ message: `Insufficient stock for: ${lessQuantityProducts.join(', ')}` })
		}
		// now everthing is clear to create header and row with header id for sales order
		const soHeader = await globalPrisma.sales_order_header.create({
			data: {
				...header,
				approval_status: 'PENDING',
				reference_number: generateReference(SO_REF_PREFIX),
			},
		})
		await createSORows(rows, soHeader.id)
		return reply.code(200).send({ message: `Sales-Order created successfully` })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}
export const salesOrderUpdateController = async (
	request: FastifyRequest<{ Body: TSOCreateUpdatePayload; Params: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params
		const { header, rows } = request.body
		const [userId, userType] = [request.user.id, request.user.userType.name as TUserTypes]
		// check the user is exist or not
		const user = await getUser(header.created_by)
		if (!user) {
			return reply.code(404).send({ message: 'User not found' })
		}
		const theSOHeader = await getSOHeader(id)

		if (!theSOHeader || (theSOHeader?.created_by !== userId && userType !== 'ADMIN')) {
			return reply.code(400).send({ message: 'You are not authorized to update this Sales Order' })
		}
		if (theSOHeader?.approval_status !== 'PENDING') {
			return reply.code(400).send({ message: 'Sales Order cannot be updated after it is approved or rejected' })
		}

		// check product quantity validation
		const [areValid, lessQuantityProducts] = await areProductsQuantityValid(rows)
		if (!areValid) {
			return reply.code(400).send({ message: `Insufficient stock for: ${lessQuantityProducts.join(', ')}` })
		}

		await Promise.all([updateSOHeader(id, header), deleteSORows(id)])
		await createSORows(rows, id)
		return reply.code(200).send({ message: `Sales-Order updated successfully` })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}
export const SODeleteController = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
	try {
		const [userId, userType] = [request.user.id, request.user.userType.name as TUserTypes]
		const { id } = request.params
		const theSOHeader = await getSOHeader(id)

		if (!theSOHeader || !(theSOHeader?.created_by === userId || userType === 'ADMIN')) {
			throw new Error('You are not authorized to delete this Sales Order')
		}
		if (theSOHeader?.approval_status !== 'PENDING') {
			throw new Error('Sales Order cannot be deleted after it is approved or rejected')
		}
		await deleteSORows(id)
		await deleteSOHeader(id)
		return reply.code(200).send({ message: 'Sales Order deleted successfully' })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}
export const approveSOController = async (
	request: FastifyRequest<{ Body: TSOApproveBody; Params: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params
		const { isApprove } = request.body
		// check is so exist
		const [theSOHeader, soRows] = await Promise.all([
			getSOHeader(id),
			globalPrisma.sales_order_row.findMany({ where: { header_id: id } }),
		])
		if (!theSOHeader || theSOHeader.approval_status !== 'PENDING') {
			return reply.code(400).send({ message: 'Invalid Sales Order' })
		}
		const [areValid, lessQuantityProducts] = await areProductsQuantityValid(soRows)
		if (!areValid) {
			return reply.code(400).send({ message: `Insufficient stock for: ${lessQuantityProducts.join(', ')}` })
		}
		const approvalStatus = isApprove ? 'APPROVED' : 'REJECTED'
		await globalPrisma.sales_order_header.update({
			where: { id },
			data: { approval_status: approvalStatus },
		})
		if (isApprove) {
			await Promise.all([
				...soRows.map(({ product_id, quantity }) =>
					globalPrisma.inventory_stock.update({
						where: { product_id },
						data: { quantity: { decrement: quantity } },
					})
				),
				globalPrisma.inventory_transaction.createMany({
					data: soRows.map(({ product_id, product_name, quantity }) => ({
						type: 'OUT',
						product_id,
						product_name,
						transaction_quantity: quantity,
					})),
				}),
			])
		}
		return reply.code(200).send({ message: `Sales-Order ${isApprove ? `approved` : `rejected`} successfully` })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}
