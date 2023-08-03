"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const model_1 = __importDefault(require("../model"));
class Connection {
    constructor(params) {
        this.params = params;
    }
    create() {
        try {
            this.connection = mysql2_1.default.createConnection({
                host: this.params.host,
                port: this.params.port,
                password: this.params.password,
                database: this.params.database,
                user: this.params.user
            });
            console.log(`Connected to the '${this.connection.config.database}' database.`);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            return {
                Model: new model_1.default(this.connection)
            };
        }
    }
}
exports.Connection = Connection;
