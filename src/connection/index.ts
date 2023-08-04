import mysql, { Connection as Conn } from "mysql2";

import Model from "../model";

export interface ConnectionParams {
  host?: string;
  port?: number;
  password?: string;
  database?: string;
  user?: string;
}

export type ReturnConnection = Record<string, Model>;

export class Connection {
  private params!: ConnectionParams;
  private connection!: Conn;

  constructor(params: ConnectionParams) {
    this.params = params;
  }

  public create(modelNames: string[]): ReturnConnection {
    const models: Record<string, Model> = {};

    try {
      this.connection = mysql.createConnection({
        host: this.params.host,
        port: this.params.port,
        password: this.params.password,
        database: this.params.database,
        user: this.params.user
      });

      console.log(`Connected to the '${this.connection.config.database}' database.`);

      for (const modelName of modelNames)
        models[modelName] = new Model(this.connection);
    } catch (error) {
      console.log(error);
    } finally {
      return models;
    }
  }
}