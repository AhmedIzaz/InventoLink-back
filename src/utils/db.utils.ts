import { globalPrisma } from '../app'

export const getCategoryById = async (id: number) => globalPrisma.category.findFirst({ where: { id } })
