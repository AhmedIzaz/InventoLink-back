import { FastifyInstance } from 'fastify'
import userRoute from './userRoute'
import authRoute from './authenticationRoute'

const mainRoutes = async (fastifyInstance: FastifyInstance) => {
	await fastifyInstance.register(authRoute, { prefix: '/auth' })
	await fastifyInstance.register(userRoute, { prefix: '/user' })
}

export default mainRoutes
