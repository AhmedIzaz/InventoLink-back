import { FastifyInstance } from 'fastify'
import {
	userListController,
	userCreateController,
	userUpdateController,
	userDeleteController,
	userTypeDDLController,
} from '../controllers/userController'
import userSchema from '../schemas/user'
import { isAdminPermitted } from '../middlewares/authMiddleware'

const userRoute = async (fastifyInstance: FastifyInstance) => {
	const { list, create, update } = userSchema

	// user list
	fastifyInstance.get('/list', { schema: list, preHandler: [isAdminPermitted] }, userListController)
	// user type ddl
	fastifyInstance.get('/user-type/dropdown', { preHandler: [isAdminPermitted] }, userTypeDDLController)
	// user create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, userCreateController)
	// user update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, userUpdateController)
	// user delete
	fastifyInstance.delete('/delete/:id', { preHandler: [isAdminPermitted] }, userDeleteController)
}

export default userRoute
