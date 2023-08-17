import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { Types } from "../enum";

export type Id = {
  type?: Types;
  notnull?: boolean;
  autoincrement?: boolean;
  length?: number;
  primarykey?: boolean;
};

export type Columns = {
  id?: Id;
} & {
  [column: string]: {
    type?: Types;
    notnull?: boolean;
    autoincrement?: boolean;
    length?: number;
    primarykey?: boolean;
  };
};

export type AssociationFk = {
  column?: string; 
  type?: Types; 
  referenceTable?: string; 
  referenceId?: any;
}

export type AssociationPk = {
  column?: string; 
  type?: Types;
  mainTable?: string;
  mainId?: any;
}

export interface Result {
  rows?: Columns[] | OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket;
  columns?: Columns;
  query?: string;
  message?: string;
}

export type SearchParams = {
  column?: string;
  value?: any;
  index?: number;
}