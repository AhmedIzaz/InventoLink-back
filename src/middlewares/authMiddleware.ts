import jwt from 'jsonwebtoken'
// @ts-ignore
import fastifyOauth2 from '@fastify/oauth2'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const notLoggedIn = async (request: FastifyRequest, reply: FastifyReply) => {
	let loggedIn = false
	try {
		if (request.headers.authorization) {
			const tokenNotExpired = jwt.verify(request.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY!, {
				ignoreExpiration: false,
			})
			if (tokenNotExpired) {
				loggedIn = true
				throw new Error('Already being logged in')
			}
		}
	} catch (err: any) {
		if (loggedIn) return reply.status(400).send({ message: err.message })
	}
}

export const isLoggedIn = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const token = request?.headers?.authorization?.split(' ')[1]
		if (!token) throw new Error('Authentication required')
		// this will automatically throw an error if the token is expired which will take it to the catch block and throw error response, else it will return the tokens main data
		const data = jwt.verify(token, process.env.JWT_SECRET_KEY!, {
			ignoreExpiration: false,
		})
		request.user = data as TUser
	} catch (err: any) {
		return reply.status(401).send({ message: err.message })
	}
}

export const isAdminPermitted = async <Tb, Tq, Tp>(request: FastifyRequest<TFastifyRequestInit>, reply: FastifyReply) => {
	if (request.user.user_type_id !== 1) return reply.code(400).send({ message: 'Admin permitted only' })
}

export const googleOauthMiddleware = async (fastify: FastifyInstance) => {
	await fastify.register(fastifyOauth2, {
		name: 'googleOAuth2',
		scope: ['profile', 'email'],
		credentials: {
			auth: fastifyOauth2.GOOGLE_CONFIGURATION,
			client: {
				id: process.env.GOOGLE_CLIENT_ID!,
				secret: process.env.GOOGLE_CLIENT_SECRET!,
			},
		},
		startRedirectPath: '/auth/google',
		callbackUri: process.env.GOOGLE_CALLBACK_URL!,
	})
}
