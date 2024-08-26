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
	try {
		const missingProducts = await Promise.all(
			rows.map(async (product) => {
				const exist = await globalPrisma.product.findFirst({ where: { id: product.product_id } })
				return exist ? null : product.product_name
			})
		)
		const missingProductNames = missingProducts.filter(Boolean) as string[]
		return [missingProductNames.length === 0, missingProductNames]
	} catch (err: any) {
		throw new Error(err.message || 'Error while validating products, try again later')
	}
}

export const areProductsQuantityValid = async (rows: TSORow[]): Promise<[boolean, (string | null)[]]> => {
	try {
		const invalidQuantityProduct = await Promise.all(
			rows.map(async ({ product_id, quantity, product_name }) => {
				const product = await globalPrisma.inventory_stock.findFirst({ where: { product_id } })
				return !product || product.quantity < quantity ? product_name : null
			})
		)
		const lessQuantityProducts = invalidQuantityProduct.filter(Boolean) as string[]
		return [lessQuantityProducts.length === 0, lessQuantityProducts]
	} catch (err: any) {
		throw new Error(err.message || 'Error while validating products quantity, try again later')
	}
}
