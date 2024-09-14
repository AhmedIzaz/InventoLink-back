import { globalPrisma } from '../app'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getCommonFilter, makeDDL } from '../utils'
import { Prisma } from '@prisma/client'
import { getSupplier, getSupplierByEmail } from '../utils/db.utils'

export const supplierListController = async (
	request: FastifyRequest<{ Querystring: TCommonRequestFilter }>,
	reply: FastifyReply
) => {
	try {
		const { pageSize, current, orderBy, orderField, search = '' } = request?.query

		const args = {
			...getCommonFilter({ pageSize, current, orderBy, orderField }),
			where: {
				OR: [
					{ name: { contains: search, mode: 'insensitive' } },
					{ email: { contains: search } },
					{ contact: { contains: search } },
				],
			} as Prisma.supplierWhereInput,
		}

		const [data, total] = await Promise.all([
			globalPrisma.supplier.findMany(args),
			globalPrisma.supplier.count({ where: args.where }),
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
		const supplier = await getSupplierByEmail(email)
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
	request: FastifyRequest<{ Body: TSupplierForm; Params: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params ?? {}
		const { name, email, contact } = request.body

		const [supplier, anotherSupplier] = await Promise.all([getSupplier(id), getSupplierByEmail(email)])

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
		const supplier = await getSupplier(id)

		if (!supplier) {
			throw new Error('Supplier not found')
		}

		await globalPrisma.supplier.delete({ where: { id } })
		return reply.code(200).send({ message: 'Supplier deleted successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const searchableSupplierDDLController = async (
	request: FastifyRequest<{ Querystring: { search?: string } }>,
	reply: FastifyReply
) => {
	const { search } = request.query
	try {
		const supplierList = await globalPrisma.supplier.findMany({
			where: { name: { contains: search, mode: 'insensitive' } },
			take: 200,
		})
		const dropdownList = makeDDL<TSupplier>(supplierList, 'name', 'id')
		return reply.code(200).send(dropdownList)
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}
