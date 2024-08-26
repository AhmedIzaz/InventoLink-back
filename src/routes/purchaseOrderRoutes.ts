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

	fastifyInstance.addHook('preHandler', isWarehouseStaffPermitted)
	// PO list
	fastifyInstance.get('/list', { schema: list }, POListController)
	// PO details
	fastifyInstance.get('/details/:id', { schema: details }, PODetailsController)
	// PO create
	fastifyInstance.post('/create', { schema: create }, POCreateController)
	// PO update
	fastifyInstance.put('/update/:id', { schema: update }, POUpdateController)
	// PO delete
	fastifyInstance.delete('/delete/:id', { schema: purchaseOrderSchema.delete }, PODeleteController)
}

export default purchaseOrderRoute
