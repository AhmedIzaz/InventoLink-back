import bcrypt from 'bcrypt'
import axios from 'axios'
import { globalPrisma } from '../app'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { cookieObj, generateToken } from '../utils'

export const loginController = async (request: FastifyRequest<{ Body: TLogin }>, reply: FastifyReply) => {
	try {
		const { email, password } = request.body

		// check user with this email exist or not
		const userExist = await globalPrisma.user.findFirst({ where: { email, isOauthUser: false } })
		if (!userExist) throw new Error(`User with this email doesn't exists`)

		// check is password match or not
		const passwordMatched = await bcrypt.compare(password, userExist?.password!)
		if (!passwordMatched) throw new Error(`Password does not match`)

		// create token validaity of 60 seconds
		const token = generateToken(userExist)
		return reply.code(200).send({ message: 'User loggedin successfully', token, user: userExist })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const googleOauthController = async (fastifyInstance: FastifyInstance) => {
	fastifyInstance.get('/google/callback', async (request, reply) => {
		try {
			const _token = await fastifyInstance.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

			// Request user info from Google API
			const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: {
					Authorization: `Bearer ${_token.token.access_token}`,
				},
			})

			const userInfo: TGoogleUser = userInfoResponse.data
			// check user with this email exist or not
			const userExist = await globalPrisma.user.findFirst({
				where: { email: userInfo.email, isOauthUser: true, oauthProvider: 'GOOGLE' },
			})

			if (!userExist) {
				let message = 'No google user with this email exist in the system'
				throw new Error(message)
			}

			const token = generateToken(userExist)
			return reply
				.setCookie('token', JSON.stringify(token), cookieObj)
				.redirect(process.env.CLIENT_LOGIN_URL! + `?token=${token}`)
		} catch (err: any) {
			return reply
				.setCookie('token', '', cookieObj)
				.redirect(process.env.CLIENT_LOGIN_URL! + `?message=${err.message}`)
		}
	})
}
