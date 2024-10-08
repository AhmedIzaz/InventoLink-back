type TProductListQueryType = TCommonRequestFilter & { category_id?: number }

type TProduct = {
	id: number
	name: string
	description?: string | null
	price: number
	category_id: number
}

type TProductForm = {
	name: string
	description?: string
	price: number
	category_id: number
}
