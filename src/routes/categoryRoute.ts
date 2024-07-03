import { FastifyInstance } from 'fastify'
import categorySchema from '../schemas/category'
import { isAdminPermitted } from '../middlewares/authMiddleware'
import {
	categoryCreateController,
	categoryUpdateController,
	categoryListController,
    categoryDeleteController,
} from '../controllers/categoryController'

const categoryRoute = async (fastifyInstance: FastifyInstance) => {
	const { create, update } = categorySchema
	// category list
	fastifyInstance.get('/list', categoryListController)
	// category create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, categoryCreateController)
	// category update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, categoryUpdateController)
    // category delete
    fastifyInstance.delete('/delete/:id', { preHandler: [isAdminPermitted] }, categoryDeleteController)
}

export default categoryRoute
