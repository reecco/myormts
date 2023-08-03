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
class Model {
    constructor(connection) {
        this.connection = connection;
    }
    define(table, columns) {
        this.table = table;
        this.columns = columns;
    }
    generateTable() {
        const query = `
    CREATE TABLE ${this.table} (
      ${Object.keys(this.columns).map(column => `${column} ${this.columns[column].type}${this.columns[column].length ? `(${this.columns[column].length})` : ``}
        ${this.columns[column].notnull ? `NOT NULL` : ``}
        ${this.columns[column].primarykey ? `PRIMARY KEY` : ``}`)}
    );`;
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, rows, _) => {
                if (error)
                    return reject(error);
                const result = { rows, message: "Table generated successfully." };
                resolve(result);
            });
        });
    }
    dropTable() {
        const query = `
      DROP TABLE ${this.table};
    `;
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, rows, _) => {
                if (error)
                    return reject(error);
                const result = { rows, message: "Table deleted successfully." };
                resolve(result);
            });
        });
    }
    find(value, index) {
        const query = `
      ${index === -1 ?
            `SELECT * FROM ${this.table} WHERE ${value} = (SELECT MAX(${value}) FROM ${this.table});` :
            `SELECT * FROM ${this.table};`}
    `;
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, rows, fields) => {
                if (error)
                    return reject(error);
                resolve({ rows: rows, fields });
            });
        });
    }
    findById(id) {
        const query = `
      SELECT * FROM ${this.table} 
      WHERE id=${id};
    `;
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, rows, fields) => {
                if (error)
                    reject(error);
                const result = { rows, fields };
                resolve(result);
            });
        });
    }
    insert(values) {
        const columns = Object.keys(values).join(', ');
        const placeholders = Object.keys(values).map(() => '?').join(', ');
        const query = `
      INSERT INTO ${this.table} (${columns}, id)
      VALUES (${placeholders}, ?);
    `;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const lastId = yield this.find("id", -1);
            const id = lastId.rows.length ? lastId.rows[0].id + 1 : 0;
            const valuesArray = [...Object.values(values), id];
            this.connection.query(query, valuesArray, (error, rows, _) => {
                if (error)
                    return reject(error);
                resolve(rows);
            });
        }));
    }
    findByIdAndUpdate(id, values) {
        const columns = Object.keys(values).map(column => `${column} = ?`).join(', ');
        const query = `
      UPDATE ${this.table}
      SET ${columns}
      WHERE id = ?;
    `;
        const valuesArray = [...Object.values(values), id];
        return new Promise((resolve, reject) => {
            this.connection.query(query, valuesArray, (error, rows, _) => {
                if (error)
                    return reject(error);
                resolve(rows);
            });
        });
    }
    findByIdAndDelete(id) {
        const query = `
      DELETE FROM ${this.table} 
      WHERE id = ?;
    `;
        const valuesArray = [id];
        return new Promise((resolve, reject) => {
            this.connection.query(query, valuesArray, (error, rows, _) => {
                if (error)
                    return reject(error);
                resolve(rows);
            });
        });
    }
}
exports.default = Model;
