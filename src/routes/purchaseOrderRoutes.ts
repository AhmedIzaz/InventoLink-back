import { FastifyInstance } from 'fastify'
import { isAdminPermitted, isWarehouseStaffPermitted } from '../middlewares/authMiddleware'
import purchaseOrderSchema from '../schemas/purchaseOrder.schema'
import {
	POCreateController,
	PODeleteController,
	PODetailsController,
	POListController,
	POUpdateController,
} from '../controllers/purchaseOrderController'

const purchaseOrderRoute = async (fastifyInstance: FastifyInstance) => {
	const { details, list, create, update } = purchaseOrderSchema
	// PO list
	fastifyInstance.get(
		'/list',
		{ schema: list, preHandler: [isAdminPermitted, isWarehouseStaffPermitted] },
		POListController
	)
	// PO details
	fastifyInstance.get(
		'/details/:id',
		{ schema: details, preHandler: [isAdminPermitted, isWarehouseStaffPermitted] },
		PODetailsController
	)
	// PO create
	fastifyInstance.post(
		'/create',
		{ schema: create, preHandler: [isAdminPermitted, isWarehouseStaffPermitted] },
		POCreateController
	)
	// PO update
	fastifyInstance.put(
		'/update/:id',
		{ schema: update, preHandler: [isAdminPermitted, isWarehouseStaffPermitted] },
		POUpdateController
	)
	// PO delete
	fastifyInstance.delete(
		'/delete/:id',
		{ schema: purchaseOrderSchema.delete, preHandler: [isAdminPermitted, isWarehouseStaffPermitted] },
		PODeleteController
	)
}

export default purchaseOrderRoute
