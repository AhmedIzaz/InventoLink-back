"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPrisma = void 0;
// import library things
const client_1 = require("@prisma/client");
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const fastify_1 = __importDefault(require("fastify"));
// import routes
const routes_1 = __importDefault(require("./routes"));
const middlewares_1 = __importDefault(require("./middlewares"));
exports.globalPrisma = new client_1.PrismaClient();
const fastifyInstance = (0, fastify_1.default)({
    logger: true,
    ajv: {
        customOptions: {
            allErrors: true,
        },
        plugins: [ajv_errors_1.default],
    },
});
const appBuilder = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, middlewares_1.default)(fastifyInstance);
    yield fastifyInstance.register(routes_1.default);
    return fastifyInstance;
});
appBuilder()
    .then((fastifyInstance) => {
    fastifyInstance.listen(process.env.PORT, process.env.DOMAIN, (err, address) => {
        if (err) {
            fastifyInstance.log.error(err);
            process.exit(1);
        }
        fastifyInstance.log.info(`server listening on ${address}`);
    });
})
    .catch((error) => {
    console.log(error);
    process.exit(1);
});
