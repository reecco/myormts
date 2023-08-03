import { Connection as Conn, FieldPacket, ResultSetHeader } from "mysql2";
import { Types } from "../enum";

export interface Columns {
  [column: string]: {
    id?: number;
    type?: Types;
    notnull?: boolean;
    autoincrement?: boolean;
    length?: number;
    primarykey?: boolean;
    // value?: ValueTypeFromType<Types>
    // value?: [value: number | string | Date | boolean]
  };
}

export interface Rows {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

// export type Rows = OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket;

export interface Result {
  rows: Columns[];
  fields?: FieldPacket[];
  message?: string;
}

class Model {
  private connection!: Conn;
  private columns!: Record<string, any>;
  private table!: string;

  constructor(connection: Conn) {
    this.connection = connection;
  }

  public define(table: string, columns: Columns): void {
    this.table = table;
    this.columns = columns;
  }

  public generateTable(): Promise<Result> {
    const query = `
    CREATE TABLE ${this.table} (
      ${Object.keys(this.columns).map(column =>
      `${column} ${this.columns[column].type}${this.columns[column].length ? `(${this.columns[column].length})` : ``}
        ${this.columns[column].notnull ? `NOT NULL` : ``}
        ${this.columns[column].primarykey ? `PRIMARY KEY` : ``}`
    )}
    );`;

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, rows, _) => {
        if (error)
          return reject(error);

        const result = { rows, message: "Table generated successfully." };

        resolve(result as Result);
      });
    });
  }

  public dropTable(): Promise<Result> {
    const query = `
      DROP TABLE ${this.table};
    `;

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, rows, _) => {
        if (error)
          return reject(error);

        const result = { rows, message: "Table deleted successfully." };

        resolve(result as Result);
      });
    });
  }

  public find(value?: string, index?: number): Promise<Result> {
    const query = `
      ${index === -1 ?
        `SELECT * FROM ${this.table} WHERE ${value} = (SELECT MAX(${value}) FROM ${this.table});` :
        `SELECT * FROM ${this.table};`}
    `;

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, rows, fields) => {
        if (error)
          return reject(error);

        resolve({ rows: rows as Columns[], fields });
      });
    })
  }

  public findById(id: number): Promise<Result> {
    const query = `
      SELECT * FROM ${this.table} 
      WHERE id=${id};
    `;

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, rows, fields) => {
        if (error)
          reject(error);

        const result = { rows, fields };

        resolve(result as Result);
      });
    });
  }

  public insert(values: any): Promise<ResultSetHeader> {
    const columns = Object.keys(values).join(', ');
    const placeholders = Object.keys(values).map(() => '?').join(', ');

    const query = `
      INSERT INTO ${this.table} (${columns}, id)
      VALUES (${placeholders}, ?);
    `;

    return new Promise(async (resolve, reject) => {
      const lastId = await this.find("id", -1) as any;

      const id: number = lastId.rows.length ? lastId.rows[0].id + 1 : 0;

      const valuesArray = [...Object.values(values), id];

      this.connection.query(query, valuesArray, (error, rows, _) => {
        if (error)
          return reject(error);

        resolve(rows as ResultSetHeader);
      });
    });
  }

  public findByIdAndUpdate(id: number, values: any): Promise<ResultSetHeader> {
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

        resolve(rows as ResultSetHeader);
      });
    });
  }

  public findByIdAndDelete(id: number): Promise<ResultSetHeader> {
    const query = `
      DELETE FROM ${this.table} 
      WHERE id = ?;
    `;

    const valuesArray = [id];

    return new Promise((resolve, reject) => {
      this.connection.query(query, valuesArray, (error, rows, _) => {
        if (error)
          return reject(error);

        resolve(rows as ResultSetHeader);
      });
    });
  }
}

export default Model;