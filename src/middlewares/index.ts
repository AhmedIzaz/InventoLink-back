import fastifyCors from '@fastify/cors'
import { FastifyInstance } from 'fastify'

const mainMiddleware = async (fastifyInstance: FastifyInstance) => {
	await fastifyInstance.register(fastifyCors, {
		origin: 'http://localhost:3000',
		methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
	})
}

export default mainMiddleware
