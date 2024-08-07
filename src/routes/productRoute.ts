import { FastifyInstance } from 'fastify'
import { isAdminPermitted } from '../middlewares/authMiddleware'
import productSchema from '../schemas/product'
import {
	productCreateController,
	productDeleteController,
	productListController,
	productUpdateController,
} from '../controllers/productController'

const productRoute = async (fastifyInstance: FastifyInstance) => {
	const { list, create, update } = productSchema

	// product list
	fastifyInstance.get('/list', { schema: list }, productListController)
	// product create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, productCreateController)
	// product update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, productUpdateController)
	// product delete
	fastifyInstance.delete('/delete/:id', { preHandler: [isAdminPermitted] }, productDeleteController)
}

export default productRoute
