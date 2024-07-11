import { IProcessSpecificationProcedure } from "./IProcessSpecificationProcedure";

export interface IPreheat {
    id: number;
    name: number;
    processSpecificationProcedure: IProcessSpecificationProcedure;
    date: Date;
}