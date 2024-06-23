import { FastifyInstance } from 'fastify'
import { loginController } from '../controllers/authenticationController'
import authenticationSchema from '../schemas/authentication'

const authRoute = async (fastifyInstance: FastifyInstance) => {
	const { login } = authenticationSchema
	fastifyInstance.post(
		'/login',
		{
			schema: login,
		},
		loginController
	)
}

export default authRoute
