import { FastifyInstance } from 'fastify'
import userRoute from './userRoute'
import { isLoggedIn } from '../middlewares/authMiddleware'
import categoryRoute from './categoryRoute'
import supplierRoute from './supplierRoute'
import productRoute from './productRoute'
import inventoryStockRoute from './inventoryStockRoute'

const authenticatedRoute = async (fastifyInstance: FastifyInstance) => {
	fastifyInstance.addHook('onRequest', isLoggedIn)

	await fastifyInstance.register(userRoute, { prefix: '/user' })
	await fastifyInstance.register(categoryRoute, { prefix: '/category' })
	await fastifyInstance.register(productRoute, { prefix: '/product' })
	await fastifyInstance.register(supplierRoute, { prefix: '/supplier' })
	await fastifyInstance.register(inventoryStockRoute, { prefix: '/inventory-stock' })
}

export default authenticatedRoute
