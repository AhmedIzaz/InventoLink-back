import { FastifyInstance } from 'fastify'
import userRoute from './userRoute'

const mainRoutes = async (fastifyInstance: FastifyInstance) => {
	await fastifyInstance.register(userRoute, { prefix: '/user' })
}

export default mainRoutes
