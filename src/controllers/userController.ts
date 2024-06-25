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

export const userCreateUpdateController = async (
	request: FastifyRequest<{ Body: TUser; Params?: { id: number } }>,
	reply: FastifyReply
) => {
	try {
		const { id } = { ...(request.params ?? {}) }
		const { username, email, password, contact, user_type_id } = request.body
		const isCreate = request.method === 'POST'

		const user = await globalPrisma.user.findFirst({ where: { email } })
		if (user && (isCreate || user?.id !== id)) throw new Error(`User with this email already exists`)

		const payload = { username, email, contact, user_type_id }
		// if create then only create else update
		let message: string
		if (isCreate) {
			const encryptedPassword = await bcrypt.hash(password, +process.env.PASSWORD_SALT!)
			await globalPrisma.user.create({ data: { ...payload, password: encryptedPassword } })
			message = 'User created successfully'
		} else {
			await globalPrisma.user.update({ where: { id }, data: payload })
			message = 'User updated successfully'
		}

		return reply.code(200).send({ message })
	} catch (error: any) {
		return reply.code(400).send({ message: error.message })
	}
}
