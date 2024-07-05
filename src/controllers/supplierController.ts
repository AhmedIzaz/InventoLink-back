import { globalPrisma } from '../app'
import { FastifyReply, FastifyRequest } from 'fastify'

export const supplierListController = async (_: FastifyRequest, reply: FastifyReply) => {
	try {
		const data = await globalPrisma.supplier.findMany()
		return reply.code(200).send({ data })
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
