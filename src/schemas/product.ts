import { FastifySchema } from 'fastify'

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
	create: productCreateSchema,
	update: { ...productCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default productSchema

type TProductSchema = {
	create: FastifySchema
	update: FastifySchema
}
