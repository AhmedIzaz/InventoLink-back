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

export const getPaginationFilter = (pageSize: number, current: number) => ({
	skip: pageSize * (current - 1),
	take: pageSize,
})

export const getCommonFilter = ({ pageSize, current, orderBy, orderField }: TCommonRequestFilter) => {
	return {
		...getPaginationFilter(pageSize, current),
		orderBy: {
			...(orderField ? { [orderField]: orderBy } : {}),
		},
	}
}

export const makeDDL = <T>(dataList: T[], label: keyof T, value: keyof T, spreadOtherFields?: boolean) => {
	return dataList.map((item) => ({ label: item[label], value: item[value], ...(spreadOtherFields && { ...item }) }))
}
