import { FastifyInstance } from 'fastify'
import {
	userListController,
	userCreateController,
	userUpdateController,
	userDeleteController,
} from '../controllers/userController'
import userSchema from '../schemas/user'
import { isAdminPermitted } from '../middlewares/authMiddleware'

const userRoute = async (fastifyInstance: FastifyInstance) => {
	const { create, update } = userSchema

	// user list
	fastifyInstance.get('/list', userListController)
	// user create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, userCreateController)
	// user update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, userUpdateController)
	// user delete
	fastifyInstance.delete('/delete/:id', { preHandler: [isAdminPermitted] }, userDeleteController)
}

export default userRoute
