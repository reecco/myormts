"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryModel = void 0;
class QueryModel {
    static select(table, { column, value, index }) {
        if (column) {
            if (index === -1)
                return `SELECT * FROM ${table} WHERE ${column} = (SELECT MAX(${column}) FROM ${table});`;
            if (typeof (value) === "number") {
                if (!Number.isInteger(value))
                    return `SELECT * FROM ${table} WHERE ROUND(${column}, 2) = ?;`;
                return `SELECT * FROM ${table} WHERE ${column} = ?;`;
            }
            if (value && column)
                return `SELECT * FROM ${table} WHERE ${column} = ?;`;
        }
        return `SELECT * FROM ${table};`;
    }
    static insert(table, values) {
        const columns = Object.keys(values).join(', ');
        const placeholders = Object.keys(values).map(() => '?').join(', ');
        return `INSERT INTO ${table} (${columns}, id) VALUES (${placeholders}, ?);`;
    }
    static update(table, { column, value }) {
        const columns = Object.keys(value).map(column => `${column} = ?`).join(', ');
        return `UPDATE ${table} SET ${columns} WHERE ${column} = ?;`;
    }
    static delete(table, { column }) {
        return `DELETE FROM ${table} WHERE ${column} = ?;`;
    }
    static createTable(table, columns) {
        return `
    CREATE TABLE ${table} (
      ${Object.keys(columns).map(column => `${column} ${columns[column].type}${columns[column].length ? `(${columns[column].length})` : ``}
        ${columns[column].notnull ? `NOT NULL` : ``}
        ${columns[column].primarykey ? `PRIMARY KEY` : ``}`)}
    );`;
    }
    static dropTable(table) {
        return `DROP TABLE ${table};`;
    }
}
exports.QueryModel = QueryModel;
