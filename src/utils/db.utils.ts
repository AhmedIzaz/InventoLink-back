import { globalPrisma } from '../app'

export const getCategoryById = async (id: number) => globalPrisma.category.findFirst({ where: { id } })

//
// PO header related queries
export const getPOHeader = async (id: number) => globalPrisma.purchase_order_header.findFirst({ where: { id } })
export const updatePOHeader = async (id: number, data: TPOHeader) =>
	globalPrisma.purchase_order_header.update({ where: { id }, data })
export const deletePOHeader = async (id: number) => globalPrisma.purchase_order_header.delete({ where: { id } })
//
// PO row related queries
export const createPORows = async (rows: TPORow[], header_id: number) =>
	globalPrisma.purchase_order_row.createMany({ data: rows?.map((item) => ({ ...item, header_id })) })
export const deletePORows = async (header_id: number) => globalPrisma.purchase_order_row.deleteMany({ where: { header_id } })
