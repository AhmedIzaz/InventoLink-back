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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_currencies_ddl = void 0;
const __1 = require("../../../..");
const get_all_currencies_ddl = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all_currencies = yield __1.globalPrisma.master_currency.findMany();
        const currency_ddl = all_currencies.map((item) => ({
            label: item === null || item === void 0 ? void 0 : item.currency_name,
            value: item === null || item === void 0 ? void 0 : item.id,
        }));
        return res.status(200).json(currency_ddl).end();
    }
    catch (error) {
        return res.status(500).json({ message: error.message }).end();
    }
});
exports.get_all_currencies_ddl = get_all_currencies_ddl;
