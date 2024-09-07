import { FastifySchema } from 'fastify'
import { commonRequestFilter } from '.'

const salesOrderCreateSchema: FastifySchema = {
	body: {
		type: 'object',
		properties: {
			header: {
				type: 'object',
				properties: {
					reference_number: { type: 'string' },
					description: { type: 'string' },
					customer_name: { type: 'string' },
					created_by: { type: 'number' },
					total_price: { type: 'number' },
				},
				required: ['created_by', 'total_price', 'customer_name'],
			},
			rows: {
				type: 'array',
				minItems: 1,
				items: {
					type: 'object',
					properties: {
						product_id: { type: 'number' },
						product_name: { type: 'string' },
						quantity: { type: 'number' },
						total_price: { type: 'number' },
						description: { type: 'string' },
					},
					required: ['product_id', 'product_name', 'quantity', 'total_price'],
				},
			},
		},
		required: ['header', 'rows'],
	},
}
const salesOrderSchema: TSalesOrderSchema = {
	list: commonRequestFilter({ created_by: { type: 'number' }, approval_status: { type: 'string' } }),
	create: salesOrderCreateSchema,
	update: { ...salesOrderCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default salesOrderSchema
type TSalesOrderSchema = {
	list: FastifySchema
	create: FastifySchema
	update: FastifySchema
}
