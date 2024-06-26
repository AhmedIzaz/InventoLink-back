import { FastifyInstance } from 'fastify'
import { loginController, googleOauthController } from '../controllers/authenticationController'
import authenticationSchema from '../schemas/authentication'
import { notLoggedIn } from '../middlewares/authMiddleware'

const authRoute = async (fastifyInstance: FastifyInstance) => {
	// if already logged in then dont give access to any api end point
	fastifyInstance.addHook('preHandler', notLoggedIn)

	// normal server login
	const { login } = authenticationSchema
	fastifyInstance.post('/login', { schema: login }, loginController)

	// google oauth
	await googleOauthController(fastifyInstance)
}

export default authRoute
