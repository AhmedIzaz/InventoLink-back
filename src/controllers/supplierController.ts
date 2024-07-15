import { globalPrisma } from '../app'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getCommonFilter } from '../utils'

export const supplierListController = async (
	request: FastifyRequest<{ Querystring: TCommonRequestFilter }>,
	reply: FastifyReply
) => {
	try {
		const { pageSize, current, orderBy, orderField, search = '' } = request?.query

		const [data, total] = await Promise.all([
			globalPrisma.supplier.findMany({
				...getCommonFilter({ pageSize, current, orderBy, orderField }),
				where: {
					OR: [{ name: { contains: search } }, { email: { contains: search } }, { contact: { contains: search } }],
				},
			}),
			globalPrisma.supplier.count(),
		])

		const pageInfo = { pageSize, current, total }
		return reply.code(200).send({ data, pageInfo })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const supplierCreateController = async (request: FastifyRequest<{ Body: TSupplierForm }>, reply: FastifyReply) => {
	try {
		const { name, email, contact } = request.body
		const supplier = await globalPrisma.supplier.findFirst({ where: { email } })
		if (supplier) {
			throw new Error('Supplier with this email already exists')
		}
		const payload: TSupplierForm = { name, email, contact }
		await globalPrisma.supplier.create({ data: payload })
		return reply.code(200).send({ message: 'Supplier created successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const supplierUpdateController = async (
	request: FastifyRequest<{ Body: TSupplierForm; Params?: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params ?? {}
		const { name, email, contact } = request.body

		const [supplier, anotherSupplier] = await Promise.all([
			globalPrisma.supplier.findFirst({ where: { id } }),
			globalPrisma.supplier.findFirst({ where: { email } }),
		])

		if (!supplier) {
			throw new Error('Supplier not found')
		}

		if (anotherSupplier && anotherSupplier?.id !== id) {
			throw new Error('Supplier with this email already exists')
		}
		const payload: TSupplierForm = { name, email, contact }
		await globalPrisma.supplier.update({ where: { id }, data: payload })
		return reply.code(200).send({ message: 'Supplier updated successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const supplierDeleteController = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
	try {
		const { id } = request.params ?? {}
		const supplier = await globalPrisma.supplier.findFirst({ where: { id: +id } })

		if (!supplier) {
			throw new Error('Supplier not found')
		}

		await globalPrisma.supplier.delete({ where: { id: +id } })
		return reply.code(200).send({ message: 'Supplier deleted successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}
