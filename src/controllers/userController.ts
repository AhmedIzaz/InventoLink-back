import bcrypt from 'bcrypt'
import { globalPrisma } from '../app'
import { FastifyReply, FastifyRequest } from 'fastify'

export const userListController = async (_: FastifyRequest, reply: FastifyReply) => {
	try {
		// user list without admin...
		const userList = await globalPrisma.user.findMany({
			where: { id: { not: 1 } },
			select: { id: true, email: true, username: true, contact: true, user_type_id: true },
		})
		return reply.code(200).send({ data: userList })
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
