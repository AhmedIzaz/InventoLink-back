import { globalPrisma } from '../app'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getCommonFilter } from '../utils'

export const categoryListController = async (
	request: FastifyRequest<{ Querystring: TCommonRequestFilter }>,
	reply: FastifyReply
) => {
	try {
		const { pageSize, current, orderBy, orderField, search = '' } = request?.query
		const args = {
			...getCommonFilter({ pageSize, current, orderBy, orderField }),
			where: { name: { contains: search } },
		}
		const [data, total] = await Promise.all([
			globalPrisma.category.findMany(args),
			globalPrisma.category.count({ where: args.where }),
		])
		const pageInfo = { pageSize, current, total }
		return reply.code(200).send({ data, pageInfo })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const categoryCreateController = async (request: FastifyRequest<{ Body: TCategoryForm }>, reply: FastifyReply) => {
	try {
		const { name, description } = request.body
		const category = await globalPrisma.category.findFirst({ where: { name } })
		if (category) {
			throw new Error('Category already exists')
		}
		const payload: TCategoryForm = { name, description }
		await globalPrisma.category.create({ data: payload })
		return reply.code(200).send({ message: 'Category created successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const categoryUpdateController = async (
	request: FastifyRequest<{ Body: TCategoryForm; Params?: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params ?? {}
		const { name, description } = request.body

		const [category, anotherCategory] = await Promise.all([
			globalPrisma.category.findFirst({ where: { id } }),
			globalPrisma.category.findFirst({ where: { name } }),
		])

		if (!category) {
			throw new Error('Category not found')
		}

		if (anotherCategory && anotherCategory?.id !== id) {
			throw new Error('Category with this name already exists')
		}
		const payload: TCategoryForm = { name, description }
		await globalPrisma.category.update({ where: { id }, data: payload })
		return reply.code(200).send({ message: 'Category updated successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const categoryDeleteController = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
	try {
		const { id } = request.params ?? {}
		const category = await globalPrisma.category.findFirst({ where: { id: +id } })

		if (!category) {
			throw new Error('Category not found')
		}

		await globalPrisma.category.delete({ where: { id: +id } })
		return reply.code(200).send({ message: 'Category deleted successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}
