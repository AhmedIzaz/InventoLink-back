import { CookieSerializeOptions } from '@fastify/cookie'
import jwt from 'jsonwebtoken'
import { globalPrisma } from '../app'

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

export const PO_REF_PREFIX = 'PO-'
export const SO_REF_PREFIX = 'SO-'

export const generateReference = (prefix: string = '') => {
	return prefix + Math.floor(Math.random() * 1000000000).toString(36) + '-' + Date.now()
}

export const areProductsValid = async (rows: TPORow[]): Promise<[boolean, (string | null)[]]> => {
	// Validate that all products exist
	const missingProducts = await Promise.all(
		rows.map(async (product) => {
			const exist = await globalPrisma.product.findFirst({ where: { id: product.product_id } })
			return exist ? null : product.product_name
		})
	)
	const missingProductNames = missingProducts.filter(Boolean)
	const areValid = missingProductNames.length > 0 ? false : true
	return [areValid, missingProductNames]
}


