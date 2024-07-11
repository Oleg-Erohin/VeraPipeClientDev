import { IProcessSpecificationProcedure } from "./IProcessSpecificationProcedure";

export interface IPostWeldHeatTreatment {
    id: number;
    name: number;
    processSpecificationProcedure: IProcessSpecificationProcedure;
    date: Date;
}