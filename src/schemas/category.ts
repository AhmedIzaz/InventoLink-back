import { FastifySchema } from 'fastify'

const categoryCreateSchema: FastifySchema = {
	body: {
		type: 'object',
		properties: {
			name: { type: 'string', minLength: 3 },
			description: { type: 'string' },
		},
		required: ['name'],
	},
}

const categorySchema: TCategorySchema = {
	create: categoryCreateSchema,
	update: { ...categoryCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default categorySchema

type TCategorySchema = {
	create: FastifySchema
	update: FastifySchema
}
