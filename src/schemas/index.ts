import { FastifySchema } from 'fastify'

export const commonRequestFilter = (properties?: Record<string, any>, requiredFields?: string[]) => {
	return {
		querystring: {
			type: 'object',
			properties: {
				pageSize: { type: 'number' },
				current: { type: 'number' },
				...properties,
			},
			required: ['pageSize', 'current', ...(requiredFields ?? [])],
		},
	}
}

export const commonSearchableRequestFilter = (properties?: any, requireds?: string[]): FastifySchema => {
	return {
		querystring: {
			type: 'object',
			properties: { search: { type: 'string', maxLength: 50 }, ...properties },
			required: ['search', ...(requireds ?? [])],
		},
	}
}
