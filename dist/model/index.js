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
const list_1 = require("../utils/list");
// type ValueTypeFromType<T extends Types> =
//   T extends Types.STRING
//   ? string
//   : T extends Types.INTEGER
//   ? number
//   : T extends Types.FLOAT
//   ? number
//   : T extends Types.BOOLEAN
//   ? boolean
//   : T extends Types.DATE
//   ? Date
//   : null;
class Model {
    constructor(table, connection, columns) {
        this.table = table;
        this.columns = columns;
        this.connection = connection;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT * FROM ${this.table} WHERE id=${id};
    `;
            const result = yield this.connection.query(query);
            return result;
        });
    }
    find(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT * FROM ${this.table};
    `;
            try {
                const [rows, fields] = yield this.connection.query(query);
                this.list = (0, list_1.mapping)(rows);
                return this.list.slice(index);
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    findByIdAndUpdate(id, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const columns = Object.keys(values).map(column => `${column} = ?`).join(', ');
            const query = `
      UPDATE ${this.table}
      SET ${columns}
      WHERE id = ?;
    `;
            const valuesArray = [...Object.values(values), id];
            try {
                const results = yield this.connection.query(query, valuesArray);
                const filtered = (0, list_1.mapping)(results);
                return { results, message: filtered[0].row.affectedRows ? "Row updated successfully." : "ID not found." };
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    findByIdAndDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      DELETE FROM ${this.table}
      WHERE id = ?;
    `;
            try {
                const results = yield this.connection.query(query, [id]);
                const filtered = (0, list_1.mapping)(results);
                return { results, message: filtered[0].row.affectedRows ? "Row deleted successfully." : "ID not found." };
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    insert(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const columns = Object.keys(values).join(', ');
            const placeholders = Object.keys(values).map(() => '?').join(', ');
            const query = `
      INSERT INTO ${this.table} (${columns}, id)
      VALUES (${placeholders}, ?)
    `;
            const lastId = yield this.find(-1);
            try {
                if (!lastId.length)
                    throw new Error("Register not found.");
                const valuesArray = [...Object.values(values), (lastId[0].row.id + 1)];
                const result = yield this.connection.query(query, valuesArray);
                return { result, message: "Row inserted successfully." };
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    generateTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    CREATE TABLE ${this.table} (
      ${Object.keys(this.columns).map(column => `${column} ${this.columns[column].type}${this.columns[column].length ? `(${this.columns[column].length})` : ``}
        ${this.columns[column].notnull ? `NOT NULL` : ``}
        ${this.columns[column].primarykey ? `PRIMARY KEY` : ``}`)}
    )`;
            try {
                const result = yield this.connection.query(query);
                return { result, message: "Table generated successfully." };
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    dropTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      DROP TABLE ${this.table};
    `;
            try {
                const result = yield this.connection.query(query);
                return { result, message: "Table deleted successfully." };
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
}
exports.default = Model;
