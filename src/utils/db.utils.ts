import { globalPrisma } from '../app'

//
// user related queries
export const getUser = async (id: number) => globalPrisma.user.findFirst({ where: { id } })
export const getUserByEmail = async (email: string) => globalPrisma.user.findFirst({ where: { email } })
//
// supplier related queries
export const getSupplier = async (id: number) => globalPrisma.supplier.findFirst({ where: { id } })
export const getSupplierByEmail = async (email: string) => globalPrisma.supplier.findFirst({ where: { email } })
// category related queries
export const getCategoryById = async (id: number) => globalPrisma.category.findFirst({ where: { id } })
export const getCategoryByName = async (name: string) => globalPrisma.category.findFirst({ where: { name } })

//
// product
export const getProductById = async (id: number) => globalPrisma.product.findFirst({ where: { id } })

//
// inventory stock related queries
export const getInventoryStockById = async (id: number) => globalPrisma.inventory_stock.findFirst({ where: { id } })
export const getInventoryStockByProductId = async (product_id: number) =>
	globalPrisma.inventory_stock.findFirst({ where: { product_id } })
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
