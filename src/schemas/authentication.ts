import { FastifySchema } from 'fastify'

const authenticationSchema: TAuthenticationSchema = {
	login: {
		body: {
			type: 'object',
			properties: {
				email: { type: 'string' },
				password: { type: 'string' },
			},
			required: ['email', 'password'],
		},
		response: {
			200: {
				type: 'object',
				properties: {
					token: {
						type: 'string',
					},
					message: { type: 'string' },
					user: {
						type: 'object',
						properties: {
							id: { type: 'number' },
							username: { type: 'string' },
							email: { type: 'string' },
							contact: { type: 'string' },
							user_type_id: { type: 'number' },
						},
					},
				},
			},
		},
	},
}

export default authenticationSchema

type TAuthenticationSchema = {
	login: FastifySchema
}
