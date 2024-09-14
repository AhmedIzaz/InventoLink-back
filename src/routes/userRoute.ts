import { FastifyInstance } from 'fastify'
import {
	userListController,
	userCreateController,
	userUpdateController,
	userDeleteController,
	userTypeDDLController,
	searchableUserDDLController,
} from '../controllers/userController'
import userSchema from '../schemas/user'
import { isAdminPermitted } from '../middlewares/authMiddleware'
import { commonSearchableRequestFilter } from '../schemas'

const userRoute = async (fastifyInstance: FastifyInstance) => {
	const { list, create, update } = userSchema

	// user list
	fastifyInstance.get('/list', { schema: list, preHandler: [isAdminPermitted] }, userListController)
	// user dropdown searchable
	// no need user type permission because it will be
	// used by both warehouse and sales staff in
	// inventory transactions list
	fastifyInstance.get(
		'/searchable-ddl',
		{ schema: commonSearchableRequestFilter({ user_type_id: { type: 'number' } }) },
		searchableUserDDLController
	)
	// user type ddl
	fastifyInstance.get('/user-type/dropdown', { preHandler: [isAdminPermitted] }, userTypeDDLController)
	// user create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, userCreateController)
	// user update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, userUpdateController)
	// user delete
	fastifyInstance.delete(
		'/delete/:id',
		{ schema: userSchema.delete, preHandler: [isAdminPermitted] },
		userDeleteController
	)
}

export default userRoute
