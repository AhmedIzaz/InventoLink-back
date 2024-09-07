import { FastifyInstance } from 'fastify'
import salesOrderSchema from '../schemas/salesOrderSchema'
import { isSalesStaffPermitted } from '../middlewares/authMiddleware'
import { getSOListController } from '../controllers/salesOrderController'

const salesOrderRoutes = async (fastifyInstance: FastifyInstance) => {
	const { list } = salesOrderSchema
	fastifyInstance.addHook('preHandler', isSalesStaffPermitted)
	// SO list
	fastifyInstance.get('/list', { schema: list }, getSOListController)
}
export default salesOrderRoutes
