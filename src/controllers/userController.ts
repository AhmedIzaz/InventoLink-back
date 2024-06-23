import bcrypt from 'bcrypt'
import { globalPrisma } from '../app'
import { FastifyReply, FastifyRequest } from 'fastify'

export const userCreate = async (request: FastifyRequest<{ Body: TUser }>, reply: FastifyReply) => {
	try {
		const { username, email, password, contact, user_type_id } = request.body
		const userExist = await globalPrisma.user.findFirst({
			where: {
				email,
			},
		})
		if (userExist) throw new Error(`User with this email already exists`)
		const encryptedPassword = await bcrypt.hash(password, +process.env.PASSWORD_SALT!)
		await globalPrisma.user.create({
			data: {
				username,
				email,
				password: encryptedPassword,
				contact,
				user_type_id,
			},
		})
		return reply.code(200).send({ message: 'User created successfully' })
	} catch (error: any) {
		console.log(error)
		return reply.code(400).send({ message: error.message })
	}
}
