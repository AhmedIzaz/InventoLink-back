import { FastifyInstance } from 'fastify'
import { isAdminPermitted } from '../middlewares/authMiddleware'
import productSchema from '../schemas/product'
import {
	productCreateController,
	productDeleteController,
	productListController,
	productUpdateController,
	searchableProductDDLController,
} from '../controllers/productController'
import { commonSearchableRequestFilter } from '../schemas'

const productRoute = async (fastifyInstance: FastifyInstance) => {
	const { list, create, update } = productSchema

	// product list
	fastifyInstance.get('/list', { schema: list }, productListController)
	// product dropdown searchable
	fastifyInstance.get(
		'/searchable-ddl',
		{ schema: commonSearchableRequestFilter({ spreadOtherFields: { type: 'boolean' } }) },
		searchableProductDDLController
	)
	// product create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, productCreateController)
	// product update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, productUpdateController)
	// product delete
	fastifyInstance.delete(
		'/delete/:id',
		{ schema: productSchema.delete, preHandler: [isAdminPermitted] },
		productDeleteController
	)
}

export default productRoute
