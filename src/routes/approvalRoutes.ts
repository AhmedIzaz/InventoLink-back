import { FastifyInstance } from 'fastify'
import { isAdminPermitted } from '../middlewares/authMiddleware'
import { approvePOController, getPOApproveListController } from '../controllers/poApproveController'
import { approveSOController, getSOApproveListController } from '../controllers/soApproveController'
import approvalSchema from '../schemas/approval.schema'

const approvalRoute = async (fastifyInstance: FastifyInstance) => {
	const { poList, poApprove, soList, soApprove } = approvalSchema
	fastifyInstance.addHook('preHandler', isAdminPermitted)
	// purchase order approval
	// po list for approval  - basically pendings
	fastifyInstance.get('/purchase-order/list', { schema: poList }, getPOApproveListController)
	// po approve or reject
	fastifyInstance.put('/purchase-order/:id', { schema: poApprove }, approvePOController)

	// sales order approval
	// so list for approval  - basically pendings
	fastifyInstance.get('/sales-order/list', { schema: soList }, getSOApproveListController)
	// so approve or reject
	fastifyInstance.put('/sales-order/:id', { schema: soApprove }, approveSOController)
}

export default approvalRoute
