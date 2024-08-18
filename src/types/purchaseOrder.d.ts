type TPOHeader = {
	id?: number
	reference_number?: string
	description?: string
	supplier_id: number
	created_by: number
	total_price: number
}
type TPORow = {
	id?: number
	header_id: number
	product_id: number
	product_name: string
	quantity: number
	total_price: number
	description?: string
}

type TPOListQueryType = TCommonRequestFilter & {
	approval_status?: TApprovalStatus
	supplier_id?: number
	created_by?: number
}

type TPOCreateUpdatePayload = {
	header: TPOHeader
	rows: TPORow[]
}
