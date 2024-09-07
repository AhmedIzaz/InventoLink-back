type TSOHeader = {
	id?: number
	reference_number?: string
	description?: string
	customer_name: string
	created_by: number
	total_price: number
	approval_status?: TApprovalStatus
}
type TSORow = {
	id?: number
	header_id: number
	product_id: number
	product_name: string
	quantity: number
	total_price: number
	description?: string | null
}

type TSOListQueryType = TCommonRequestFilter & {
	approval_status?: TApprovalStatus
	created_by?: number
}

type TSOCreateUpdatePayload = {
	header: TSOHeader
	rows: TSORow[]
}
