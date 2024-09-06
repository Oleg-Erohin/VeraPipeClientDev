import { IProcessSpecificationProcedure } from "./IProcessSpecificationProcedure";

export interface IPreheat {
    id: number;
    name: String;
    processSpecificationProcedure: IProcessSpecificationProcedure;
    date: Date;
}