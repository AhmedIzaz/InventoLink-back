import { FastifyInstance } from 'fastify'
import { loginController } from '../controllers/authenticationController'
import authenticationSchema from '../schemas/authentication'
import { notLoggedIn } from '../middlewares/authMiddleware'

const authRoute = async (fastifyInstance: FastifyInstance) => {
	fastifyInstance.addHook('preHandler', notLoggedIn)

	const { login } = authenticationSchema
	fastifyInstance.post('/login', { schema: login }, loginController)
}

export default authRoute
