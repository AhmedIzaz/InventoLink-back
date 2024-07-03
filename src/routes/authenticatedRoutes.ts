import { FastifyInstance } from 'fastify'
import userRoute from './userRoute'
import { isLoggedIn } from '../middlewares/authMiddleware'
import categoryRoute from './categoryRoute'

const authenticatedRoute = async (fastifyInstance: FastifyInstance) => {
	fastifyInstance.addHook('preHandler', isLoggedIn)
    
	await fastifyInstance.register(userRoute, { prefix: '/user' })
	await fastifyInstance.register(categoryRoute, { prefix: '/category' })
}

export default authenticatedRoute
