import { FastifyInstance } from 'fastify'
import { isAdminPermitted } from '../middlewares/authMiddleware'
import {
	supplierCreateController,
	supplierDeleteController,
	supplierListController,
	supplierUpdateController,
} from '../controllers/supplierController'
import supplierSchema from '../schemas/supplier'

const supplierRoute = async (fastifyInstance: FastifyInstance) => {
	const { create, update } = supplierSchema

	// supplier list
	fastifyInstance.get('/list', supplierListController)
	// supplier create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, supplierCreateController)
	// supplier update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, supplierUpdateController)
	// supplier delete
	fastifyInstance.delete('/delete/:id', { preHandler: [isAdminPermitted] }, supplierDeleteController)
}

export default supplierRoute
