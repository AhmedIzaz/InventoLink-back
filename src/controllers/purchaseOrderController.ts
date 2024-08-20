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
			include: { purchase_order_row: true },
		})
		if (!header) {
			return reply.code(404).send({ message: 'Purchase Order not found' })
		}
		const { purchase_order_row, ...purchase_order_header } = { ...(header ?? {}) }
		return reply.code(200).send({ data: { header: purchase_order_header, rows: purchase_order_row } })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const POCreateController = async (request: FastifyRequest<{ Body: TPOCreateUpdatePayload }>, reply: FastifyReply) => {
	try {
		const { header, rows } = { ...(request.body ?? {}) }
		// check the supplier and user is exist or not
		const [user, supplier] = await Promise.all([getUser(header.created_by), getSupplier(header.supplier_id)])
		if (!user || !supplier) {
			return reply.code(404).send({ message: 'User or Supplier not found' })
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
			throw new Error('You are not authorized to update this Purchase Order')
		}
		if (thePOHeader?.approval_status !== 'PENDING') {
			throw new Error('Purchase Order cannot be updated after it is approved or rejected')
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
