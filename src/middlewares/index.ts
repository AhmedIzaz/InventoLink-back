import fastifyCors from '@fastify/cors'
import { FastifyInstance } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { googleOauthMiddleware } from './authMiddleware'
const mainMiddleware = async (fastifyInstance: FastifyInstance) => {
	await fastifyInstance.register(fastifyCors, {
		credentials: true,
		origin: 'http://localhost:3000',
		methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
	})
	await fastifyInstance.register(fastifyCookie)

	// oauth middlewares
	await googleOauthMiddleware(fastifyInstance)
}

export default mainMiddleware
