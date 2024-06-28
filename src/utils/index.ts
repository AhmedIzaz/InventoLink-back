import { CookieSerializeOptions } from '@fastify/cookie'
import jwt from 'jsonwebtoken'

export const generateToken = (user: TUser): string => {
	const { id, username, email, contact, user_type_id, isOauthUser, oauthProvider } = user
	const token = jwt.sign(
		{ id, username, contact, email, user_type_id, isOauthUser, oauthProvider },
		process.env.JWT_SECRET_KEY!,
		{
			expiresIn: 60,
		}
	)
	return token
}

export const cookieObj: CookieSerializeOptions = {
	httpOnly: false,
	secure: false,
	sameSite: 'lax',
	path: '/',
}
