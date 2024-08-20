import { FastifyInstance } from 'fastify'
import { isAdminPermitted } from '../middlewares/authMiddleware'
import inventoryStockSchema from '../schemas/inventoryStock.schema'
import {
	inventoryStockCreateController,
	inventoryStockDeleteController,
	inventoryStockListController,
	inventoryStockUpdateController,
} from '../controllers/inventoryStockController'

const inventoryStockRoute = async (fastifyInstance: FastifyInstance) => {
	const { list, create, update } = inventoryStockSchema

	// inventory-stock list
	fastifyInstance.get('/list', { schema: list }, inventoryStockListController)
	// inventory-stock create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, inventoryStockCreateController)
	// inventory-stock update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, inventoryStockUpdateController)
	// inventory-stock delete
	fastifyInstance.delete(
		'/delete/:id',
		{ schema: inventoryStockSchema.delete, preHandler: [isAdminPermitted] },
		inventoryStockDeleteController
	)
}

export default inventoryStockRoute
