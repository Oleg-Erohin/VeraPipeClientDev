import { UnitOfMeasure } from "../enums/UnitOfMeasure";
import { ICoordinate } from "./ICoordinate";

export interface IJoint {
    id: number;
    number: number;
    coordinates: ICoordinate;
    pidName: string;
    isometricName: string;
    sheetOnIsometric: number;
    uom: UnitOfMeasure;
    schedule: string;
    diameter: number;
    fittingDescription1: string;
    baseMaterialTypeName1: string;
    baseMaterialHeatNum1: string;
    fittingDescription2: string;
    baseMaterialTypeName2: string;
    baseMaterialHeatNum2: string;
    thickness: number;
    fillerMaterialTypeName1: string;
    fillerMaterialHeatNum1: string;
    fillerMaterialTypeName2: string;
    fillerMaterialHeatNum2: string;
    processSpecificationProcedureName: string;
    joinerTagId1: string;
    joinerTagId2: string;
    date: Date;
    isFitUpDone: boolean;
    isVisualInspectionDone: boolean;
    ndtReportName: string;
    isNdtPassed: boolean;
    preheatName: string;
    postWeldHeatTreatmentName: string;
    comments: string;
}