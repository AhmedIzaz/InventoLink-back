import bcrypt from 'bcrypt'
import axios from 'axios'
import { globalPrisma } from '../app'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

export const loginController = async (request: FastifyRequest<{ Body: TLogin }>, reply: FastifyReply) => {
	try {
		const { email, password } = request.body

		// check user with this email exist or not
		const userExist = await globalPrisma.user.findFirst({ where: { email } })
		if (!userExist) throw new Error(`User with this email doesn't exists`)

		// check is password match or not
		const passwordMatched = await bcrypt.compare(password, userExist?.password)
		if (!passwordMatched) throw new Error(`Password does not match`)

		// create token validaity of 60 seconds
		const { id, username, contact, user_type_id } = userExist
		const token = jwt.sign({ id, username, contact, email, user_type_id }, process.env.JWT_SECRET_KEY!, {
			expiresIn: 60,
		})
		return reply.code(200).send({ message: 'User loggedin successfully', token, user: userExist })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const googleOauthController = async (fastifyInstance: FastifyInstance) => {
	fastifyInstance.get('/google/callback', async (request, reply) => {
		try {
			const token = await fastifyInstance.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

			// Request user info from Google API
			const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: {
					Authorization: `Bearer ${token.token.access_token}`,
				},
			})

			const userInfo = userInfoResponse.data
			return reply
				.setCookie('user', JSON.stringify(userInfo), {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
					sameSite: 'lax',
					path: '/',
				})
				.redirect('http://localhost:3000')
		} catch (err: any) {
			return reply.status(400).send({ message: err.message })
		}
	})
}
