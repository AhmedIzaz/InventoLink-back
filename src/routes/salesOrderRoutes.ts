import { FastifyInstance } from 'fastify'
import salesOrderSchema from '../schemas/salesOrderSchema'
import { isSalesStaffPermitted } from '../middlewares/authMiddleware'
import { getSOListController, salesOrderCreateController, salesOrderUpdateController } from '../controllers/salesOrderController'

const salesOrderRoutes = async (fastifyInstance: FastifyInstance) => {
	const { list, create, update } = salesOrderSchema
	fastifyInstance.addHook('preHandler', isSalesStaffPermitted)
	// SO list
	fastifyInstance.get('/list', { schema: list }, getSOListController)
	// SO Create
	fastifyInstance.post('/create', { schema: create }, salesOrderCreateController)
	// SO update
	fastifyInstance.post('/update', { schema: update }, salesOrderUpdateController)
	//SO Delete
}
export default salesOrderRoutes
