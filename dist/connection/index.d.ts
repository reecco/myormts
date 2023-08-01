import mysql, { Connection as Conn } from "mysql2/promise";
type ConnectionParams = {
    host?: string;
    port?: number;
    password?: string;
    database?: string;
    user?: string;
};
type ResultConnection = {
    result: Conn;
    message: string;
};
export declare class Connection {
    protected connection: Conn;
    create(conn: ConnectionParams, callback: (result: ResultConnection | null, error: unknown | null) => void): Promise<void>;
    getConnection(): mysql.Connection;
}
declare const _default: Connection;
export default _default;
