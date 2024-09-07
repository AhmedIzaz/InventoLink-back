import { FastifySchema } from 'fastify'
import { commonRequestFilter } from '.'

const purchaseOrderCreateSchema: FastifySchema = {
	body: {
		type: 'object',
		properties: {
			header: {
				type: 'object',
				properties: {
					reference_number: { type: 'string' },
					description: { type: 'string' },
					supplier_id: { type: 'number' },
					created_by: { type: 'number' },
					total_price: { type: 'number' },
				},
				required: ['supplier_id', 'created_by', 'total_price'],
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

const purchaseOrderSchema: TPurchaseOrderSchema = {
	list: commonRequestFilter({
		supplier_id: { type: 'number' },
		created_by: { type: 'number' },
		approval_status: { type: 'string' },
	}),
	details: { params: { type: 'object', properties: { id: { type: 'number' } } } },
	create: purchaseOrderCreateSchema,
	update: { ...purchaseOrderCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
	delete: { params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default purchaseOrderSchema

type TPurchaseOrderSchema = {
	list: FastifySchema
	details: FastifySchema
	create: FastifySchema
	update: FastifySchema
	delete: FastifySchema
}
