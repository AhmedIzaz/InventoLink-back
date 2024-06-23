// import library things
import { PrismaClient } from '@prisma/client'
import ajvErrors from 'ajv-errors'
import fastify from 'fastify'
// import routes
import mainRoute from './routes'
import mainMiddleware from './middlewares'

export const globalPrisma = new PrismaClient()
const fastifyInstance = fastify({
	logger: true,
	ajv: {
		customOptions: {
			allErrors: true,
		},
		plugins: [ajvErrors],
	},
})

const appBuilder = async () => {
	await mainMiddleware(fastifyInstance)
	await fastifyInstance.register(mainRoute)
	return fastifyInstance
}

appBuilder()
	.then((fastifyInstance) => {
		fastifyInstance.listen(process.env.PORT!, process.env.DOMAIN!, (err, address) => {
			if (err) {
				fastifyInstance.log.error(err)
				process.exit(1)
			}
			fastifyInstance.log.info(`server listening on ${address}`)
		})
	})
	.catch((error) => {
		console.log(error)
		process.exit(1)
	})
