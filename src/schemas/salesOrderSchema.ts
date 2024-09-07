import { FastifySchema } from 'fastify'
import { commonRequestFilter } from '.'

const salesOrderSchema: TSalesOrderSchema = {
	list: commonRequestFilter({ created_by: { type: 'number' }, approval_status: { type: 'string' } }),
}

export default salesOrderSchema
type TSalesOrderSchema = {
	list: FastifySchema
}
