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
exports.get_user_permitted_business_unit_menu = exports.user_login = exports.user_signup = void 0;
const index_1 = require("../../../../index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password: givenPassword, username, account_id, user_type_id, } = req.body;
        if (!email || !givenPassword || !username)
            return res
                .status(400)
                .json({ message: "email, password or name is missing" })
                .end();
        const user_exist = yield index_1.globalPrisma.user.findUnique({
            where: {
                email,
            },
        });
        if (user_exist)
            return res.status(400).json({ message: "user already exist" }).end();
        const encryptedPassword = yield bcrypt_1.default.hash(givenPassword, 10);
        yield index_1.globalPrisma.user.create({
            data: {
                email,
                password: encryptedPassword,
                username,
                account_id,
                user_type_id,
            },
        });
        return res.status(200).json({ message: "User created successfully" }).end();
    }
    catch (error) {
        return res.status(500).json({ message: error.message }).end();
    }
});
exports.user_signup = user_signup;
const user_login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                username: true,
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
        const { password, id, email, username } = user, userInfoWithoutPassword = __rest(user, ["password", "id", "email", "username"]);
        const { employee } = userInfoWithoutPassword;
        const token = jsonwebtoken_1.default.sign({
            userId: id,
            employeeId: employee === null || employee === void 0 ? void 0 : employee.id,
            userName: username,
            employeeName: employee === null || employee === void 0 ? void 0 : employee.employee_name,
        }, process.env.JWT_SECRET_KEY || "secret key", {
            expiresIn: "2 days",
        });
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
            token,
        })
            .end();
    }
    catch (error) {
        return res.status(500).json({ message: error.message }).end();
    }
});
exports.user_login = user_login;
const get_user_permitted_business_unit_menu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, business_unit_id } = req.query;
    try {
        const user_permitted_menu = yield index_1.globalPrisma.user_permitted_menu.findMany({
            where: {
                user_id: +user_id || 0,
                business_unit_id: +business_unit_id || 0,
            },
            select: {
                menu: {
                    select: {
                        id: true,
                        parent_menu_id: true,
                        title: true,
                        label: true,
                        is_first_level: true,
                        is_second_level: true,
                        is_third_level: true,
                        path: true,
                        has_sub_menu: true,
                    },
                },
            },
        });
        const formattedMenu = user_permitted_menu.map((item) => item.menu);
        return res.status(200).json(formattedMenu).end();
    }
    catch (error) {
        return res.status(500).json({ message: error.message }).end();
    }
});
exports.get_user_permitted_business_unit_menu = get_user_permitted_business_unit_menu;
