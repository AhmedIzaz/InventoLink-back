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
exports.get_business_unit_landing = exports.make_activity = exports.create_business_unit = void 0;
const __1 = require("../../../..");
const create_business_unit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const duplicateBusinessUnit = yield __1.globalPrisma.master_business_unit.findFirst({
            where: {
                account_id: req.body.account_id,
                business_unit_name: req.body.businessUnitName,
            },
        });
        if (duplicateBusinessUnit)
            return res
                .status(400)
                .json({ message: "Business unit already exists!" })
                .end();
        yield __1.globalPrisma.master_business_unit.create({
            data: {
                business_unit_name: req.body.businessUnitName,
                address: req.body.address,
                account_id: req.body.account_id,
                base_currency_id: (_a = req.body.baseCurrency) === null || _a === void 0 ? void 0 : _a.value,
                language: req.body.language,
                created_by: req.body.created_by,
            },
        });
        return res
            .json({ message: "Business unit created successfully" })
            .status(200)
            .end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message }).end();
    }
});
exports.create_business_unit = create_business_unit;
const make_activity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { business_unit_id, activity } = req.body;
        yield __1.globalPrisma.master_business_unit.update({
            where: {
                id: business_unit_id,
            },
            data: {
                is_active: activity,
            },
        });
        return res
            .json({
            message: `Business unit is ${activity ? "activated" : "inactived"} successfully`,
        })
            .status(200)
            .end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message }).end();
    }
});
exports.make_activity = make_activity;
const get_business_unit_landing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account_id } = req.query;
        const business_unit_landing = yield __1.globalPrisma.master_business_unit.findMany({
            where: {
                account_id: account_id ? parseInt(account_id) : 0,
            },
            include: {
                master_currency: {
                    select: {
                        currency_name: true,
                    },
                },
            },
            orderBy: {
                business_unit_name: "asc",
            },
        });
        return res.status(200).json(business_unit_landing).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message }).end();
    }
});
exports.get_business_unit_landing = get_business_unit_landing;
