import { FastifyInstance } from 'fastify'
import userRoute from './userRoute'
import { isLoggedIn } from '../middlewares/authMiddleware'

const authenticatedRoute = async (fastifyInstance: FastifyInstance) => {
	fastifyInstance.addHook('preHandler', isLoggedIn)
    
	await fastifyInstance.register(userRoute, { prefix: '/user' })
}

export default authenticatedRoute
