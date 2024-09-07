import { FastifyInstance } from 'fastify'
import salesOrderSchema from '../schemas/salesOrderSchema'
import { isSalesStaffPermitted } from '../middlewares/authMiddleware'
import { getSOListController, salesOrderCreateController } from '../controllers/salesOrderController'

const salesOrderRoutes = async (fastifyInstance: FastifyInstance) => {
	const { list, create } = salesOrderSchema
	fastifyInstance.addHook('preHandler', isSalesStaffPermitted)
	// SO list
	fastifyInstance.get('/list', { schema: list }, getSOListController)
	// SO Create
	fastifyInstance.post('/create', { schema: create }, salesOrderCreateController)
	// SO update

	//SO Delete
}
export default salesOrderRoutes
