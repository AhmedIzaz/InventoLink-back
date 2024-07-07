type TFastifyRequestInit = {
	Body?: Tb
	Querystring?: Tq
	Params?: Tp
}

type TOrder = 'asc' | 'desc'

type TCommonRequestFilter = {
	current: number
	pageSize: number
	// more work to do for order by..should common from frontend
	orderBy?: TOrder
	orderField?: string
}

type TCommonResponseFilter = { total?: number; current?: number; pageSize?: number }
