import { FastifyInstance } from 'fastify'
import { userCreate } from '../controllers/userController'
import userSchema from '../schemas/user'

const userRoute = async (fastifyInstance: FastifyInstance) => {
	const { create } = userSchema

	// user create
	fastifyInstance.post(
		'/create',
		{
			schema: create,
		},
		userCreate
	)
}

export default userRoute
