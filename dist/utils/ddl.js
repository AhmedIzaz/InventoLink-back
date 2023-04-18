"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDDL = void 0;
const makeDDL = ({ objectList, labelField, valueField, giveOtherInformation = false, }) => {
    const ddl = objectList === null || objectList === void 0 ? void 0 : objectList.map((item) => (Object.assign(Object.assign({}, (giveOtherInformation && { content: Object.assign({}, item) })), { label: item[labelField], value: item[valueField] })));
    return ddl;
};
exports.makeDDL = makeDDL;
