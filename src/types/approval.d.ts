type TPOApprovalListQueryType = TCommonRequestFilter & {
	supplier_id?: number
	created_by?: number
}

type TPOApproveBody = {
	isApprove: boolean
}

type TSOApprovalListQueryType = TCommonRequestFilter & {
	created_by?: number
}

type TSOApproveBody = {
	isApprove: boolean
}
