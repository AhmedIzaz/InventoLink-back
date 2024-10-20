import { FastifyInstance } from 'fastify'
import salesOrderSchema from '../schemas/salesOrderSchema'
import { isSalesStaffPermitted } from '../middlewares/authMiddleware'
import {
	getSOListController,
	salesOrderCreateController,
	salesOrderUpdateController,
	SODeleteController,
	SODetailsController,
} from '../controllers/salesOrderController'

const salesOrderRoutes = async (fastifyInstance: FastifyInstance) => {
	const { list, details, create, update, delete: _delete } = salesOrderSchema
	fastifyInstance.addHook('preHandler', isSalesStaffPermitted)
	// SO list
	fastifyInstance.get('/list', { schema: list }, getSOListController)
	// SO Create
	fastifyInstance.post('/create', { schema: create }, salesOrderCreateController)
	// SO update
	fastifyInstance.put('/update/:id', { schema: update }, salesOrderUpdateController)
	//SO Delete
	fastifyInstance.delete('/delete/:id', { schema: _delete }, SODeleteController)
	// SO Details
	fastifyInstance.get('/details/:id', { schema: details }, SODetailsController)
}
export default salesOrderRoutes
