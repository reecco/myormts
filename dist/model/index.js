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
const enum_1 = require("../enum");
const utils_1 = require("../utils");
class Model {
    constructor(connection) {
        this.connection = connection;
    }
    define(table, columns) {
        if (!columns["id"])
            columns.id = {
                type: enum_1.Types.INTEGER,
                notnull: true,
                primarykey: true,
                autoincrement: true,
            };
        this.columns = columns;
        this.table = table;
        Object.keys(this.columns).map((column) => this.columns[column].type !== enum_1.Types.STRING &&
            this.columns[column].length !== undefined &&
            delete this.columns[column].length);
    }
    generateTable() {
        const query = utils_1.QueryModel.createTable(this.table, this.columns);
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, rows, _) => {
                if (error)
                    return reject(error);
                const result = { rows, query: query, message: "Table generated successfully." };
                resolve(result);
            });
        });
    }
    dropTable() {
        const query = utils_1.QueryModel.dropTable(this.table);
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, rows, _) => {
                if (error)
                    return reject(error);
                const result = { rows, query: query.replace("?", this.table), message: "Table deleted successfully." };
                resolve(result);
            });
        });
    }
    find(search) {
        const query = utils_1.QueryModel.select(this.table, { column: search === null || search === void 0 ? void 0 : search.column, value: search === null || search === void 0 ? void 0 : search.value, index: search === null || search === void 0 ? void 0 : search.index });
        const valuesArray = [search === null || search === void 0 ? void 0 : search.value];
        return new Promise((resolve, reject) => {
            this.connection.query(query, valuesArray, (error, rows, _) => {
                if (error)
                    return reject(error);
                resolve({ rows: rows, query: query.replace("?", search === null || search === void 0 ? void 0 : search.value) });
            });
        });
    }
    findById(id) {
        const query = utils_1.QueryModel.select(this.table, { column: "id", value: id });
        const valuesArray = [id];
        return new Promise((resolve, reject) => {
            this.connection.query(query, valuesArray, (error, rows, _) => {
                if (error)
                    reject(error);
                const result = { rows, query: query.replace("?", id.toString()) };
                resolve(result);
            });
        });
    }
    insert(values) {
        const query = utils_1.QueryModel.insert(this.table, values);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const lastId = yield this.find({ column: "id", index: -1 });
            const id = lastId.rows.length ? lastId.rows[0].id + 1 : 0;
            const valuesArray = [...Object.values(values), id];
            this.connection.query(query, valuesArray, (error, rows, _) => {
                if (error)
                    return reject(error);
                const result = { rows, query: query };
                resolve(result);
            });
        }));
    }
    findByIdAndUpdate(id, values) {
        const query = utils_1.QueryModel.update(this.table, { column: "id", value: values });
        const valuesArray = [...Object.values(values), id];
        return new Promise((resolve, reject) => {
            this.connection.query(query, valuesArray, (error, rows, _) => {
                if (error)
                    return reject(error);
                const result = { rows, query: query };
                resolve(result);
            });
        });
    }
    findByIdAndDelete(id) {
        const query = utils_1.QueryModel.delete(this.table, { column: "id" });
        const valuesArray = [id];
        return new Promise((resolve, reject) => {
            this.connection.query(query, valuesArray, (error, rows, _) => {
                if (error)
                    return reject(error);
                const result = { rows, query: query.replace("?", id.toString()) };
                resolve(result);
            });
        });
    }
}
exports.default = Model;
