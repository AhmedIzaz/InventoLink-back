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
			isOauthUser: { type: 'boolean' },
			oauthProvider: { type: ['string', 'null'] },
		},
		required: ['username', 'email', 'contact', 'user_type_id'],
		if: {
			properties: {
				isOauthUser: { const: true },
			},
		},
		then: {
			properties: {
				oauthProvider: { type: 'string' },
			},
			required: ['oauthProvider'],
		},
		else: {
			properties: {
				oauthProvider: { type: 'null' },
			},
		},
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
