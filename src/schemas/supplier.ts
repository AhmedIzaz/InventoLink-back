import { FastifySchema } from 'fastify'
import { commonRequestFilter } from '.'

const supplierCreateSchema: FastifySchema = {
	body: {
		type: 'object',
		properties: {
			name: { type: 'string', minLength: 3 },
			email: { type: 'string', minLength: 5 },
			contact: { type: 'string', minLength: 4 },
		},
		required: ['name', 'email', 'contact'],
	},
}

const supplierSchema: TSupplierSchema = {
	list: commonRequestFilter(),
	create: supplierCreateSchema,
	update: { ...supplierCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default supplierSchema

type TSupplierSchema = {
	list: FastifySchema
	create: FastifySchema
	update: FastifySchema
}
