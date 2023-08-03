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
export interface Result {
    rows: Columns[];
    fields?: FieldPacket[];
    message?: string;
}
declare class Model {
    private connection;
    private columns;
    private table;
    constructor(connection: Conn);
    define(table: string, columns: Columns): void;
    generateTable(): Promise<Result>;
    dropTable(): Promise<Result>;
    find(value?: string, index?: number): Promise<Result>;
    findById(id: number): Promise<Result>;
    insert(values: any): Promise<ResultSetHeader>;
    findByIdAndUpdate(id: number, values: any): Promise<ResultSetHeader>;
    findByIdAndDelete(id: number): Promise<ResultSetHeader>;
}
export default Model;
