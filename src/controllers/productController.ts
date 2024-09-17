import { globalPrisma } from '../app'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getCategoryById, getProductById } from '../utils/db.utils'
import { getCommonFilter, makeDDL } from '../utils'
import { Prisma } from '@prisma/client'

export const productListController = async (
	request: FastifyRequest<{ Querystring: TProductListQueryType }>,
	reply: FastifyReply
) => {
	try {
		const { pageSize, current, orderBy, orderField, search = '', category_id } = request?.query

		const args = {
			...getCommonFilter({ pageSize, current, orderBy, orderField }),
			where: {
				category_id,
				OR: [{ name: { contains: search, mode: 'insensitive' } }],
			} as Prisma.productWhereInput,
			select: {
				id: true,
				name: true,
				price: true,
				description: true,
				categoryId: { select: { id: true, name: true } },
			},
		}
		const [data, total] = await Promise.all([
			globalPrisma.product.findMany(args),
			globalPrisma.product.count({ where: args.where }),
		])
		const pageInfo = { pageSize, current, total }
		return reply.code(200).send({ data, pageInfo })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const searchableProductDDLController = async (
	request: FastifyRequest<{ Querystring: { search?: string; spreadOtherFields?: boolean } }>,
	reply: FastifyReply
) => {
	const { search, spreadOtherFields } = request.query
	try {
		const products = await globalPrisma.product.findMany({
			where: { name: { contains: search, mode: 'insensitive' } },
			take: 200,
		})
		const dropdownList = makeDDL<TProduct>(products, 'name', 'id', spreadOtherFields)
		return reply.code(200).send(dropdownList)
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const productCreateController = async (request: FastifyRequest<{ Body: TProductForm }>, reply: FastifyReply) => {
	try {
		const { name, description, price, category_id } = request.body
		const category = await getCategoryById(category_id)
		if (!category) {
			throw new Error('Category does not exists')
		}
		const payload: TProductForm = { name, description, price, category_id }
		await globalPrisma.product.create({ data: payload })
		return reply.code(200).send({ message: 'Product created successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const productUpdateController = async (
	request: FastifyRequest<{ Body: TProductForm; Params: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params ?? {}
		const { name, description, price, category_id } = request.body
		const product = await getProductById(id)
		if (!product) {
			throw new Error('Product not found')
		}
		const category = await getCategoryById(category_id)
		if (!category) {
			throw new Error('Category does not exists')
		}
		const payload: TProductForm = { name, description, price, category_id }
		await globalPrisma.product.update({ where: { id }, data: payload })
		return reply.code(200).send({ message: 'Product updated successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const productDeleteController = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
	try {
		const { id } = request.params ?? {}
		const product = await getProductById(id)

		if (!product) {
			throw new Error('Product not found')
		}

		await globalPrisma.product.delete({ where: { id: +id } })
		return reply.code(200).send({ message: 'Product deleted successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}
