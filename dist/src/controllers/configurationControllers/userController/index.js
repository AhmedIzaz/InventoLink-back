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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = void 0;
const index_1 = require("../../../index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email: givenEmail, password: givenPassword } = req.body;
        if (!givenEmail || !givenPassword)
            return res
                .status(400)
                .json({ message: "email or password is missing" })
                .end();
        const user = yield index_1.globalPrisma.user.findFirst({
            where: {
                email: givenEmail,
            },
            select: {
                id: true,
                email: true,
                password: true,
                employee: true,
                user_permitted_business_unit: {
                    select: {
                        master_business_unit: {
                            select: {
                                business_unit_name: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user)
            return res.status(404).json({ message: "user not found" }).end();
        const passwordMatched = yield bcrypt_1.default.compare(givenPassword, user.password);
        if (!passwordMatched)
            return res.status(400).json({ message: "password is incorrect" }).end();
        const { password, id, email } = user, userInfoWithoutPassword = __rest(user, ["password", "id", "email"]);
        const { employee } = userInfoWithoutPassword;
        const permittedBusinessUnitDDL = (_a = user === null || user === void 0 ? void 0 : user.user_permitted_business_unit) === null || _a === void 0 ? void 0 : _a.map((item) => {
            var _a, _b;
            return ({
                label: (_a = item === null || item === void 0 ? void 0 : item.master_business_unit) === null || _a === void 0 ? void 0 : _a.business_unit_name,
                value: (_b = item === null || item === void 0 ? void 0 : item.master_business_unit) === null || _b === void 0 ? void 0 : _b.id,
            });
        });
        return res
            .status(200)
            .json({
            message: "Login successful",
            userInformation: {
                id,
                email,
            },
            employeeInformation: employee,
            permittedBusinessUnitDDL,
        })
            .end();
    }
    catch (error) {
        return res.status(500).json({ message: error.message }).end();
    }
});
exports.userLogin = userLogin;
