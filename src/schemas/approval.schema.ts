import { FastifySchema } from 'fastify'
import { commonRequestFilter } from '.'

const approveBody: FastifySchema = {
	params: {
		type: 'object',
		properties: { id: { type: 'number' } },
		required: ['id'],
	},
	body: {
		type: 'object',
		properties: { isApprove: { type: 'boolean' } },
		required: ['isApprove'],
	},
}

const approvalSchema: TApprovalSchema = {
	poList: commonRequestFilter({ supplier_id: { type: 'number' }, created_by: { type: 'number' } }),
	poApprove: approveBody,
	soList: commonRequestFilter({ created_by: { type: 'number' } }),
	soApprove: approveBody,
}

export default approvalSchema

type TApprovalSchema = {
	poList: FastifySchema
	poApprove: FastifySchema
	soList: FastifySchema
	soApprove: FastifySchema
}
