import { Connection } from "mysql2";
import { Types } from "../enum";
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
};
declare class Model {
    private connection;
    private columns;
    private table;
    constructor(connection: Connection);
    define(table: string, columns: Columns): void;
    generateTable(): Promise<Result>;
    dropTable(): Promise<Result>;
    find(search?: SearchParams): Promise<Result>;
    findById(id: number): Promise<Result>;
    insert(values: any): Promise<Result>;
    findByIdAndUpdate(id: number, values: any): Promise<Result>;
    findByIdAndDelete(id: number): Promise<Result>;
}
export default Model;
