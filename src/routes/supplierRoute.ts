import { FastifyInstance } from 'fastify'
import { isAdminPermitted, isWarehouseStaffPermitted } from '../middlewares/authMiddleware'
import {
	searchableSupplierDDLController,
	supplierCreateController,
	supplierDeleteController,
	supplierListController,
	supplierUpdateController,
} from '../controllers/supplierController'
import supplierSchema from '../schemas/supplier'
import { commonSearchableRequestFilter } from '../schemas'

const supplierRoute = async (fastifyInstance: FastifyInstance) => {
	const { list, create, update } = supplierSchema

	// supplier list
	fastifyInstance.get('/list', { schema: list }, supplierListController)
	// supplier dropdown searchable
	fastifyInstance.get(
		'/searchable-ddl',
		{ schema: commonSearchableRequestFilter(), preHandler: [isWarehouseStaffPermitted] },
		searchableSupplierDDLController
	)
	// supplier create
	fastifyInstance.post('/create', { schema: create, preHandler: [isAdminPermitted] }, supplierCreateController)
	// supplier update
	fastifyInstance.put('/update/:id', { schema: update, preHandler: [isAdminPermitted] }, supplierUpdateController)
	// supplier delete
	fastifyInstance.delete(
		'/delete/:id',
		{ schema: supplierSchema.delete, preHandler: [isAdminPermitted] },
		supplierDeleteController
	)
}

export default supplierRoute
