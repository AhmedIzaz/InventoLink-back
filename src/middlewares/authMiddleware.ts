import jwt from 'jsonwebtoken'
import { FastifyReply, FastifyRequest } from 'fastify'

export const notLoggedIn = async (request: FastifyRequest, reply: FastifyReply) => {
	let loggedIn = false
	try {
		if (request.headers.authorization) {
			const tokenNotExpired = jwt.verify(request.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY!)
			if (tokenNotExpired) {
				loggedIn = true
				throw new Error('Already being logged in')
			}
		}
	} catch (err: any) {
		if (loggedIn) reply.status(400).send({ message: err.message })
	}
}

export const isLoggedIn = async (request: FastifyRequest, reply: FastifyReply) => {}
