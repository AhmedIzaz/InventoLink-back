import { FastifySchema } from 'fastify'

const userCreateSchema: FastifySchema = {
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
}

const userSchema: TUserSchema = {
	create: userCreateSchema,
	update: { ...userCreateSchema, params: { type: 'object', properties: { id: { type: 'number' } } } },
}

export default userSchema

type TUserSchema = {
	create: FastifySchema
	update: FastifySchema
}
