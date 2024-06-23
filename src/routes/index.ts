import { FastifyInstance } from 'fastify'
import authRoute from './authenticationRoute'
import authenticatedRoute from './authenticatedRoutes'

const mainRoutes = async (fastifyInstance: FastifyInstance) => {
	await fastifyInstance.register(authRoute, { prefix: '/auth' })
	await fastifyInstance.register(authenticatedRoute)
}

export default mainRoutes
