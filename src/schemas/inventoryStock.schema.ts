import { FastifySchema } from 'fastify'
import { commonRequestFilter } from '.'

const inventoryStockCreateSchema: FastifySchema = {
	body: {
		type: 'object',
		properties: {
			product_id: { type: 'number' },
			quantity: { type: 'number' },
		},
		required: ['product_id', 'quantity'],
	},
}

const inventoryStockSchema: TInventoryStockSchema = {
	list: commonRequestFilter(),
	create: inventoryStockCreateSchema,
	update: { ...inventoryStockCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default inventoryStockSchema

type TInventoryStockSchema = {
	list: FastifySchema
	create: FastifySchema
	update: FastifySchema
}
