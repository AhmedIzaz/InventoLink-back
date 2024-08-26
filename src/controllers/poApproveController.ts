import { FastifyReply, FastifyRequest } from 'fastify'
import { globalPrisma } from '../app'
import { getCommonFilter } from '../utils'
import { Prisma } from '@prisma/client'
import { getPOHeader } from '../utils/db.utils'

export const getPOApproveListController = async (
	request: FastifyRequest<{ Querystring: TPOApprovalListQueryType }>,
	reply: FastifyReply
) => {
	try {
		const { pageSize, current, orderBy, orderField, search = '', supplier_id, created_by } = request?.query
		const args = {
			...getCommonFilter({ pageSize, current, orderBy, orderField }),
			where: {
				approval_status: 'PENDING',
				supplier_id,
				created_by,
				OR: [{ reference_number: { contains: search } }],
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
