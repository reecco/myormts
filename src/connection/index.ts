import mysql, { Connection as Conn } from "mysql2/promise";

type ConnectionParams = {
  host?: string;
  port?: number;
  password?: string;
  database?: string;
  user?: string;
}

type ResultConnection = {
  result: Conn;
  message: string;
}

export class Connection {
  protected connection!: Conn;

  public async create(conn: ConnectionParams, callback: (result: ResultConnection | null, error: unknown | null) => void) {
    try {
      this.connection = await mysql.createConnection({
        host: conn.host,
        port: conn.port,
        password: conn.password,
        database: conn.database,
        user: conn.user
      }) as Conn;

      return callback({result: this.connection, message: `Connected to the '${conn.database}' database.`}, null);
    } catch (error) {
      return callback(null, error);
    }
  }

  public getConnection() {
    return this.connection;
  }
}

export default new Connection();