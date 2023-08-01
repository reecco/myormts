"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapping = void 0;
const mapping = (results) => {
    const newList = [];
    for (const row of results) {
        newList.push({ row });
    }
    return newList;
};
exports.mapping = mapping;
