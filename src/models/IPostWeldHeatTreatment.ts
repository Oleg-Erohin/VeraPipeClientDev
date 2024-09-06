import { IProcessSpecificationProcedure } from "./IProcessSpecificationProcedure";

export interface IPostWeldHeatTreatment {
    id: number;
    name: String;
    processSpecificationProcedure: IProcessSpecificationProcedure;
    date: Date;
}