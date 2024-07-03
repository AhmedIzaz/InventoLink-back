import { CookieSerializeOptions } from '@fastify/cookie'
import jwt from 'jsonwebtoken'

export const generateToken = (user: TToken): string => {
	const token = jwt.sign(user, process.env.JWT_SECRET_KEY!, {
		expiresIn: 60 * 60,
	})
	return token
}

export const cookieObj: CookieSerializeOptions = {
	httpOnly: false,
	secure: false,
	sameSite: 'lax',
	path: '/',
}
