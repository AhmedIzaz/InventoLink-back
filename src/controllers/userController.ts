import bcrypt from 'bcrypt'
import { globalPrisma } from '../app'
import { FastifyReply, FastifyRequest } from 'fastify'
import { getCommonFilter } from '../utils'

export const userListController = async (
	request: FastifyRequest<{ Querystring: TCommonRequestFilter }>,
	reply: FastifyReply
) => {
	try {
		// user list without admin...
		const { pageSize, current, orderBy, orderField, search = '' } = request?.query
		const args = {
			...getCommonFilter({ pageSize, current, orderBy, orderField }),
			where: {
				id: { not: 1 },
				OR: [{ username: { contains: search } }, { email: { contains: search } }, { contact: { contains: search } }],
			},
			include: { userType: true },
		}
		const [data, total] = await Promise.all([
			globalPrisma.user.findMany(args),
			globalPrisma.user.count({ where: args.where }),
		])
		const pageInfo = { pageSize, current, total }
		return reply.code(200).send({ data, pageInfo })
	} catch (err: any) {
		return reply.code(400).send({ message: err.message })
	}
}

export const userCreateController = async (request: FastifyRequest<{ Body: TUser }>, reply: FastifyReply) => {
	try {
		const { username, email, password, contact, user_type_id, isOauthUser, oauthProvider } = request.body
		const user = await globalPrisma.user.findFirst({ where: { email } })
		if (user) {
			throw new Error('User with this email already exists')
		}
		const payload: TUser = { username, email, contact, user_type_id, isOauthUser, oauthProvider }
		if (!isOauthUser && password) {
			const encryptedPassword = await bcrypt.hash(password, +process.env.PASSWORD_SALT!)
			payload.password = encryptedPassword
		}
		await globalPrisma.user.create({ data: payload })
		return reply.code(200).send({ message: 'User created successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const userUpdateController = async (
	request: FastifyRequest<{ Body: TUser; Params?: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = request.params ?? {}
		const { username, email, password, contact, user_type_id, isOauthUser, oauthProvider } = request.body

		const [user, anotherUser] = await Promise.all([
			globalPrisma.user.findFirst({ where: { id } }),
			globalPrisma.user.findFirst({ where: { email } }),
		])

		if (!user) {
			throw new Error('User not found')
		}

		if (anotherUser && anotherUser?.id !== id) {
			throw new Error('User with this email already exists')
		}

		const payload: TUser = { username, email, contact, user_type_id, isOauthUser, oauthProvider }
		if (!isOauthUser && password) {
			const encryptedPassword = await bcrypt.hash(password, +process.env.PASSWORD_SALT!)
			payload.password = encryptedPassword
		}

		await globalPrisma.user.update({ where: { id }, data: payload })
		return reply.code(200).send({ message: 'User updated successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}

export const userDeleteController = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
	try {
		const { id } = request.params
		const user = await globalPrisma.user.findFirst({ where: { id: +id } })

		if (!user) {
			throw new Error('User not found')
		}

		await globalPrisma.user.delete({ where: { id: +id } })
		return reply.code(200).send({ message: 'User deleted successfully' })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}
