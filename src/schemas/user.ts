import { FastifySchema } from 'fastify'

const userSchema: TUserSchema = {
	create: {
		body: {
			type: 'object',
			properties: {
				username: { type: 'string' },
				email: { type: 'string' },
				password: { type: 'string' },
				contact: { type: 'string' },
				user_type_id: { type: 'number' },
			},
			required: ['username', 'email', 'password', 'contact', 'user_type_id'],
		},
	},
}

export default userSchema

type TUserSchema = {
	create: FastifySchema
}
