import { FastifyInstance } from 'fastify'
import { isAdminPermitted } from '../middlewares/authMiddleware'
import { approvePOController, getPOApproveListController } from '../controllers/poApproveController'
import { approveSOController, getSOApproveListController } from '../controllers/soApproveController'

const approvalRoute = async (fastifyInstance: FastifyInstance) => {
	// const { list, create, update } = categorySchema
	fastifyInstance.addHook('preHandler', isAdminPermitted)
	// purchase order approval
	// po list for approval  - basically pendings
	fastifyInstance.get('/purchase-order/list', getPOApproveListController)
	// po approve or reject
	fastifyInstance.put('/purchase-order/:id', approvePOController)

	// sales order approval
	// so list for approval  - basically pendings
	fastifyInstance.get('/sales-order/list', getSOApproveListController)
	// so approve or reject
	fastifyInstance.put('/sales-order/:id', approveSOController)
}

export default approvalRoute
