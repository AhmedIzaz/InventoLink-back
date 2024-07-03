import bcrypt from 'bcrypt'
import axios from 'axios'
import { globalPrisma } from '../app'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { cookieObj, generateToken } from '../utils'

export const loginController = async (request: FastifyRequest<{ Body: TLogin }>, reply: FastifyReply) => {
	try {
		const { email, password } = request.body

		// check user with this email exist or not
		const userExist = await globalPrisma.user.findFirst({
			where: { email, isOauthUser: false },
			include: { userType: true },
		})
		if (!userExist) {
			throw new Error(`User with this email doesn't exists`)
		}
		const { password: userPassword, ...user } = userExist
		// check is password match or not
		const passwordMatched = await bcrypt.compare(password, userPassword!)
		if (!passwordMatched) {
			throw new Error(`Password does not match`)
		}

		// create token validaity of 60 seconds

		const token = generateToken(user)
		return reply.code(200).send({ message: 'User loggedin successfully', token, user })
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
				include: { userType: true },
			})

			if (!userExist) {
				throw new Error('No google user with this email exist in the system')
			}

			const token = generateToken(userExist)
			const responsePayload = { message: 'User loggedin successfully', token, user: userExist }
			return reply
				.setCookie(process.env.GOOGLE_CLIENT_COOKIE_KEY!, JSON.stringify(responsePayload), cookieObj)
				.redirect(process.env.CLIENT_LOGIN_URL!)
		} catch (err: any) {
			return reply
				.setCookie(process.env.GOOGLE_ACCOUNT_NOT_FOUND_KEY!, err.message, cookieObj)
				.redirect(process.env.CLIENT_LOGIN_URL!)
		}
	})
}
