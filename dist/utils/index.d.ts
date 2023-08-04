import { SearchParams } from "../model";
export declare class QueryModel {
    static select(table: string, { column, value, index }: SearchParams): string;
    static insert(table: string, values: any): string;
    static update(table: string, { column, value }: SearchParams): string;
    static delete(table: string, { column }: SearchParams): string;
    static createTable(table: string, columns: Record<string, any>): string;
    static dropTable(table: string): string;
}
