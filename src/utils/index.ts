import { SearchParams, AssociationFk, AssociationPk } from "../@types";

export class QueryModel {
  public static select(table: string, { column, value, index }: SearchParams) {
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

  public static insert(table: string, values: any) {
    const columns = Object.keys(values).join(', ');
    const placeholders = Object.keys(values).map(() => '?').join(', ');

    return `INSERT INTO ${table} (${columns}, id) VALUES (${placeholders}, ?);`;
  }

  public static update(table: string, { column, value }: SearchParams) {
    const columns = Object.keys(value).map(column => `${column} = ?`).join(', ');

    return `UPDATE ${table} SET ${columns} WHERE ${column} = ?;`;
  }

  public static delete(table: string, { column }: SearchParams) {
    return `DELETE FROM ${table} WHERE ${column} = ?;`
  }

  public static createTable(table: string, columns: Record<string, any>) {
    return `
      CREATE TABLE ${table} (
      ${Object.keys(columns).map(column =>
      `${column} ${columns[column].type}${columns[column].length ? `(${columns[column].length})` : ``}
        ${columns[column].notnull ? `NOT NULL` : ``}
        ${columns[column].primarykey ? `PRIMARY KEY` : ``}`
      )}
      );`;
  }

  public static dropTable(table: string) {
    return `DROP TABLE ${table};`;
  }

  public static verifyTable(table: string) {
    return `SHOW TABLES LIKE "${table}";`;
  }

  public static describeTable(table: string) {
    return `DESCRIBE ${table};`;
  }

  public static belongsTo(table: string, assoc: AssociationPk) {
    return `
      ALTER TABLE ${table}
      ADD COLUMN ${assoc.column} ${assoc.type},
      ADD FOREIGN KEY (${assoc.column}) REFERENCES ${assoc.mainTable}(${assoc.mainId});
    `;
  }

  public static hasOne(table: string, assoc: AssociationFk) {
    return `
      ALTER TABLE ${table}
      ADD COLUMN ${assoc.column} ${assoc.type},
      ADD FOREIGN KEY (${assoc.column}) REFERENCES ${assoc.referenceTable}(${assoc.referenceId});
    `;
  }
}