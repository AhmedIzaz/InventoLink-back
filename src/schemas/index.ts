import { FastifySchema } from 'fastify'

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

export const commonSearchableRequestFilter: FastifySchema = {
	querystring: {
		type: 'object',
		properties: { search: { type: 'string', minLength: 3, maxLength: 50 } },
		required: ['search'],
	},
}
