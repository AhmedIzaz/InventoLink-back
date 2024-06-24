import { FastifyInstance } from 'fastify'
import { userListController, userCreateUpdateController } from '../controllers/userController'
import userSchema from '../schemas/user'
import { isAdminPermitted } from '../middlewares/authMiddleware'

const userRoute = async (fastifyInstance: FastifyInstance) => {
	const { create, update } = userSchema

	// user list
	fastifyInstance.get('/list', userListController)
	// user create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, userCreateUpdateController)
	// user update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, userCreateUpdateController)
}

export default userRoute
