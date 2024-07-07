export const commonRequestFilter = {
	querystring: {
		type: 'object',
		properties: {
			pageSize: { type: 'number' },
			current: { type: 'number' },
		},
		required: ['pageSize', 'current'],
	},
}
