export const commonRequestFilter = (properties?: Record<string, any>) => {
	return {
		querystring: {
			type: 'object',
			properties: {
				pageSize: { type: 'number' },
				current: { type: 'number' },
				...properties,
			},
			required: ['pageSize', 'current'],
		},
	}
}
