import { Connection, ConnectionParams, ReturnConnection } from "./connection";
import { Columns, Result } from "./model"
import { Types } from "./enum";
import { config } from "dotenv";
config();

const connection = new Connection({
  database: process.env.DATABASE,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.PORT as number | undefined,
  user: process.env.USER
});

connection.create();

const User = connection.model();
const Account = connection.model();

(async () => {

  User.define("users", {
    name: {
      type: Types.STRING,
      length: 100,
      notnull: true
    },
    email: {
      type: Types.STRING,
      length: 50,
      notnull: true,
    },
    created_at: {
      type: Types.DATETIME,
      length: 50,
      notnull: true
    }
  });

  User.generateTable().then(res => {
    console.log(res);
  }).catch(error => console.log(error));

  User.hasOne({ column: "id_account", type: Types.INTEGER, referenceTable: "accounts", referenceId: "id" });
  

  // const result = await User.insert({ name: "Fredinho", email: "recco.fred01@gmail.com", created_at: new Date() });

  // const result = await User.findByIdAndUpdate(0, { name: "Fredinho Cardoso" });

  // const result = await User.findByIdAndDelete(0);

  // console.log(result);

  Account.define("accounts", {
    balance: {
      type: Types.FLOAT,
      notnull: true
    },
    number_agency: {
      type: Types.INTEGER,
      notnull: true
    },
    number_account: {
      type: Types.INTEGER,
      notnull: true
    }
  });

  Account.generateTable().then(res => {
    console.log(res);
  }).catch(error => console.log(error));

  Account.belongsTo({ column: "id_user", type: Types.INTEGER, mainTable: "users", mainId: "id" });
})();

export {
  Connection,
  ConnectionParams,
  ReturnConnection,
  Columns,
  Result,
  Types,
}