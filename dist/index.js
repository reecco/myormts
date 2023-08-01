"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = exports.connection = exports.Model = void 0;
const model_1 = __importDefault(require("./model"));
exports.Model = model_1.default;
const connection_1 = __importDefault(require("./connection"));
exports.connection = connection_1.default;
const enum_1 = require("./enum");
Object.defineProperty(exports, "Types", { enumerable: true, get: function () { return enum_1.Types; } });
