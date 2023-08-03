import Model from "../model";
export interface ConnectionParams {
    host?: string;
    port?: number;
    password?: string;
    database?: string;
    user?: string;
}
export interface ReturnConnection {
    Model: Model;
}
export declare class Connection {
    private params;
    private connection;
    constructor(params: ConnectionParams);
    create(): ReturnConnection;
}
