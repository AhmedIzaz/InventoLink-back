import { FastifyInstance } from 'fastify'
import { isAdminPermitted } from '../middlewares/authMiddleware'
import approvalSchema from '../schemas/approval.schema'
import { approvePOController, POListController } from '../controllers/purchaseOrderController'
import { approveSOController, getSOListController } from '../controllers/salesOrderController'

const approvalRoute = async (fastifyInstance: FastifyInstance) => {
	const { poList, poApprove, soList, soApprove } = approvalSchema
	fastifyInstance.addHook('preHandler', isAdminPermitted)
	// purchase order approval
	// po list for approval  - basically pendings, from frontend you have to send PENDING as apporval status query value
	fastifyInstance.get('/purchase-order/list', { schema: poList }, POListController)
	// po approve or reject
	fastifyInstance.put('/purchase-order/:id', { schema: poApprove }, approvePOController)

	// sales order approval
	// so list for approval  - basically pendings
	fastifyInstance.get('/sales-order/list', { schema: soList }, getSOListController)
	// so approve or reject
	fastifyInstance.put('/sales-order/:id', { schema: soApprove }, approveSOController)
}

export default approvalRoute
