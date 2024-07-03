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
	},
}

export default authenticationSchema

type TAuthenticationSchema = {
	login: FastifySchema
}
