import { Connection } from "mysql2";
import { Types } from "../enum";
import { QueryModel } from "../utils";

export interface Columns {
  [column: string]: {
    type?: Types;
    notnull?: boolean;
    autoincrement?: boolean;
    length?: number;
    primarykey?: boolean;
  };
}

export interface Result {
  rows: Columns[];
  query: string;
  message?: string;
}

export type SearchParams = {
  column?: string;
  value?: any;
  index?: number;
}

class Model {
  private connection!: Connection;
  private columns!: Record<string, any>;
  private table!: string;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public define(table: string, columns: Columns): void {
    if (!columns["id"])
      columns.id = {
        type: Types.INTEGER,
        notnull: true,
        primarykey: true,
        autoincrement: true,
      }

    this.columns = columns;
    this.table = table;

    Object.keys(this.columns).map((column) =>
      this.columns[column].type !== Types.STRING &&
      this.columns[column].length !== undefined &&
      delete this.columns[column].length);
  }

  public generateTable(): Promise<Result> {
    const query = QueryModel.createTable(this.table, this.columns);

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, rows, _) => {
        if (error)
          return reject(error);

        const result = { rows, query: query, message: "Table generated successfully." };

        resolve(result as Result);
      });
    });
  }

  public dropTable(): Promise<Result> {
    const query = QueryModel.dropTable(this.table);

    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, rows, _) => {
        if (error)
          return reject(error);

        const result = { rows, query: query.replace("?", this.table), message: "Table deleted successfully." };

        resolve(result as Result);
      });
    });
  }

  public find(search?: SearchParams): Promise<Result> {
    const query = QueryModel.select(this.table, { column: search?.column, value: search?.value, index: search?.index });
    const valuesArray = [search?.value];

    return new Promise((resolve, reject) => {
      this.connection.query(query, valuesArray, (error, rows, _) => {
        if (error)
          return reject(error);

        resolve({ rows: rows as Columns[], query: query.replace("?", search?.value) });
      });
    })
  }

  public findById(id: number): Promise<Result> {
    const query = QueryModel.select(this.table, { column: "id", value: id });
    const valuesArray = [id];

    return new Promise((resolve, reject) => {
      this.connection.query(query, valuesArray, (error, rows, _) => {
        if (error)
          reject(error);

        const result = { rows, query: query.replace("?", id.toString()) };

        resolve(result as Result);
      });
    });
  }

  public insert(values: any): Promise<Result> {
    const query = QueryModel.insert(this.table, values);

    return new Promise(async (resolve, reject) => {
      const lastId = await this.find({ column: "id", index: -1 }) as any;

      const id: number = lastId.rows.length ? lastId.rows[0].id + 1 : 0;

      const valuesArray = [...Object.values(values), id];

      this.connection.query(query, valuesArray, (error, rows, _) => {
        if (error)
          return reject(error);

        const result = { rows, query: query };

        resolve(result as Result);
      });
    });
  }

  public findByIdAndUpdate(id: number, values: any): Promise<Result> {
    const query = QueryModel.update(this.table, { column: "id", value: values });

    const valuesArray = [...Object.values(values), id];

    return new Promise((resolve, reject) => {
      this.connection.query(query, valuesArray, (error, rows, _) => {
        if (error)
          return reject(error);

        const result = { rows, query: query };

        resolve(result as Result);
      });
    });
  }

  public findByIdAndDelete(id: number): Promise<Result> {
    const query = QueryModel.delete(this.table, { column: "id" });

    const valuesArray = [id];

    return new Promise((resolve, reject) => {
      this.connection.query(query, valuesArray, (error, rows, _) => {
        if (error)
          return reject(error);

        const result = { rows, query: query.replace("?", id.toString()) };

        resolve(result as Result);
      });
    });
  }
}

export default Model;