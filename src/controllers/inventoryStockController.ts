import { globalPrisma } from '../app'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getCommonFilter } from '../utils'
import { Prisma } from '@prisma/client'
import { getInventoryStockById, getInventoryStockByProductId, getProductById } from '../utils/db.utils'

export const inventoryStockListController = async (
	request: FastifyRequest<{ Querystring: TCommonRequestFilter }>,
	reply: FastifyReply
) => {
	try {
		const { pageSize, current, orderBy, orderField, search = '' } = request?.query
		const args = {
			...getCommonFilter({ pageSize, current, orderBy, orderField }),
			where: {
				OR: [{ productId: { name: { contains: search, mode: 'insensitive' } } }],
			} as Prisma.inventory_stockWhereInput,
			include: { productId: { select: { name: true, price: true } } },
		}
		const [data, total] = await Promise.all([
			globalPrisma.inventory_stock.findMany(args),
			globalPrisma.inventory_stock.count({ where: args.where }),
		])
		const pageInfo = { pageSize, current, total }
		return reply.code(200).send({ data, pageInfo })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const inventoryStockCreateController = async (
	request: FastifyRequest<{ Body: TInventoryStockForm }>,
	reply: FastifyReply
) => {
	try {
		const { product_id, quantity } = request.body
		const [inventoryStock, product] = await Promise.all([
			getInventoryStockByProductId(product_id),
			getProductById(product_id),
		])

		if (!product) {
			throw new Error('Product not found')
		}

		if (inventoryStock) {
			throw new Error('Inventory stock with this product already exists')
		}
		const payload: TInventoryStockForm = { product_id, quantity }
		await globalPrisma.inventory_stock.create({ data: payload })
		return reply.code(200).send({ message: 'Inventory stock created successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const inventoryStockUpdateController = async (
	request: FastifyRequest<{ Body: TInventoryStockForm; Params: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params ?? {}
		const { quantity, product_id } = request.body

		const [inventoryStock, anotherInventoryStock, product] = await Promise.all([
			getInventoryStockById(id),
			getInventoryStockByProductId(product_id),
			getProductById(product_id),
		])

		if (!inventoryStock) {
			throw new Error('Inventory stock not found')
		}

		if (anotherInventoryStock && anotherInventoryStock?.id !== id) {
			throw new Error('Inventory stock with this product already exists')
		}

		if (!product) {
			throw new Error('Product not found')
		}

		const payload: TInventoryStockForm = { quantity, product_id }
		await globalPrisma.inventory_stock.update({ where: { id }, data: payload })
		return reply.code(200).send({ message: 'Inventory stock updated successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const inventoryStockDeleteController = async (
	request: FastifyRequest<{ Params: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params ?? {}
		const inventoryStock = await getInventoryStockById(id)

		if (!inventoryStock) {
			throw new Error('Inventory stock not found')
		}

		await globalPrisma.inventory_stock.delete({ where: { id: +id } })
		return reply.code(200).send({ message: 'Inventory stock deleted successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}
