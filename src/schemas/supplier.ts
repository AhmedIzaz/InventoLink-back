import { FastifySchema } from 'fastify'

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
	create: supplierCreateSchema,
	update: { ...supplierCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default supplierSchema

type TSupplierSchema = {
	create: FastifySchema
	update: FastifySchema
}
