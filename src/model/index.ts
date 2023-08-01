import { Connection } from "mysql2/promise";
import { Types } from "../enum";
import { mapping } from "../utils/list";

export interface Columns {
  [column: string]: {
    type?: Types;
    notnull?: boolean;
    autoincrement?: boolean;
    length?: number;
    primarykey?: boolean;
    // value?: ValueTypeFromType<Types>
  };
}

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
  private columns!: Record<string, any>;
  private table!: string;
  private connection!: Connection;
  public list!: Array<{}>;

  constructor(table: string, connection: Connection, columns: Columns) {
    this.table = table;
    this.columns = columns;
    this.connection = connection;
  }

  public async findById(id: string | number) {
    const query = `
      SELECT * FROM ${this.table} 
      WHERE id=${id};
    `;

    const result = await this.connection.query(query);

    return result;
  }

  public async find(index?: number) {
    const query = `
      SELECT * FROM ${this.table};
    `;

    try {
      const [rows, fields] = await this.connection.query(query);

      this.list = mapping(rows);

      return this.list.slice(index);
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  public async findByIdAndUpdate(id: string | number, values: any) {
    const columns = Object.keys(values).map(column => `${column} = ?`).join(', ');

    const query = `
      UPDATE ${this.table}
      SET ${columns}
      WHERE id = ?;
    `;

    const valuesArray = [...Object.values(values), id];

    try {
      const results = await this.connection.query(query, valuesArray);
      const filtered = mapping(results);

      return { results, message: filtered[0].row.affectedRows ? "Row updated successfully." : "ID not found." };
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  public async findByIdAndDelete(id: string | number) {
    const query = `
      DELETE FROM ${this.table}
      WHERE id = ?;
    `;

    try {
      const results = await this.connection.query(query, [id])
      const filtered = mapping(results);
      return { results, message: filtered[0].row.affectedRows ? "Row deleted successfully." : "ID not found." };
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  public async insert(values: any) {
    const columns = Object.keys(values).join(', ');
    const placeholders = Object.keys(values).map(() => '?').join(', ');

    const query = `
      INSERT INTO ${this.table} (${columns}, id)
      VALUES (${placeholders}, ?);
    `;

    const lastId = await this.find(-1) as any;

    try {
      if (!lastId.length)
        throw new Error("Register not found.");

      const valuesArray = [...Object.values(values), (lastId[0].row.id + 1)];

      const result = await this.connection.query(query, valuesArray);
      return { result, message: "Row inserted successfully." };
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  public async generateTable() {
    const query = `
    CREATE TABLE ${this.table} (
      ${Object.keys(this.columns).map(column =>
      `${column} ${this.columns[column].type}${this.columns[column].length ? `(${this.columns[column].length})` : ``}
        ${this.columns[column].notnull ? `NOT NULL` : ``}
        ${this.columns[column].primarykey ? `PRIMARY KEY` : ``}`
    )}
    );`;

    try {
      const result = await this.connection.query(query);
      return { result, message: "Table generated successfully." };
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  public async dropTable() {
    const query = `
      DROP TABLE ${this.table};
    `;

    try {
      const result = await this.connection.query(query);
      return { result, message: "Table deleted successfully." };
    } catch (error) {
      console.log((error as Error).message);
    }
  }
}

export default Model;