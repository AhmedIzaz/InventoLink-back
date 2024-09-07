type TFastifyRequestInit<Tb, Tq, Tp> = {
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
	search?: string
}

type TCommonResponseFilter = { total?: number; current?: number; pageSize?: number }

type TApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
