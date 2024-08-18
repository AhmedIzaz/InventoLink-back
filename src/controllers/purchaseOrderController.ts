import { FastifyReply, FastifyRequest } from 'fastify'
import { generateReference, getCommonFilter, PO_REF_PREFIX } from '../utils'
import { Prisma } from '@prisma/client'
import { globalPrisma } from '../app'

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
export const PODetailsController = async (request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) => {
	try {
		const { id } = request.query
		const header = await globalPrisma.purchase_order_header.findFirst({
			where: { id },
			include: { purchase_order_row: true },
		})
		const { purchase_order_row, ...purchase_order_header } = { ...(header ?? {}) }
		const payload = {
			header: purchase_order_header,
			rows: purchase_order_row,
		}
		return reply.code(200).send({ data: payload })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const POCreateController = async (request: FastifyRequest<{ Body: TPOCreateUpdatePayload }>, reply: FastifyReply) => {
	try {
		const { header, rows } = { ...(request.body ?? {}) }
		// check the supplier and user is exist or not
		const [user, supplier] = await Promise.all([
			globalPrisma.user.findFirst({ where: { id: header.created_by } }),
			globalPrisma.supplier.findFirst({ where: { id: header.supplier_id } }),
		])
		if (!user || !supplier) {
			throw new Error(`User or Supplier not found`)
		}
		// Validate that all products exist
		const missingProducts = await Promise.all(
			rows.map(async (product) => {
				const exist = await globalPrisma.product.findFirst({ where: { id: product.product_id } })
				return exist ? null : product.product_name
			})
		)

		const missingProductNames = missingProducts.filter(Boolean)
		if (missingProductNames.length > 0) {
			return reply.code(404).send({ message: `Products not found: ${missingProductNames.join(', ')}` })
		}

		const POHeader = await globalPrisma.purchase_order_header.create({
			data: { ...header, reference_number: generateReference(PO_REF_PREFIX), approval_status: 'PENDING' },
		})
		await globalPrisma.purchase_order_row.createMany({
			data: rows?.map((item) => ({ ...item, header_id: POHeader.id })),
		})

		return reply.code(200).send({ message: 'Purchase Order created successfully' })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}
