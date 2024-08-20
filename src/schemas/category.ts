import { FastifySchema } from 'fastify'
import { commonRequestFilter } from '.'

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
	list: commonRequestFilter(),
	create: categoryCreateSchema,
	update: { ...categoryCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
	delete: { params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default categorySchema

type TCategorySchema = {
	list: FastifySchema
	create: FastifySchema
	update: FastifySchema
	delete: FastifySchema
}
