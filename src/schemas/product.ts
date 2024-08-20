import { FastifySchema } from 'fastify'
import { commonRequestFilter } from '.'

const productCreateSchema: FastifySchema = {
	body: {
		type: 'object',
		properties: {
			name: { type: 'string', minLength: 3 },
			description: { type: 'string' },
			price: { type: 'number' },
			category_id: { type: 'number' },
		},
		required: ['name', 'price', 'category_id'],
	},
}

const productSchema: TProductSchema = {
	list: commonRequestFilter({ category_id: { type: 'number' } }),
	create: productCreateSchema,
	update: { ...productCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
	delete: { params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default productSchema

type TProductSchema = {
	list: FastifySchema
	create: FastifySchema
	update: FastifySchema
	delete: FastifySchema
}
