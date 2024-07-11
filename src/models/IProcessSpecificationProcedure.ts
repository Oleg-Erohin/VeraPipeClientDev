import { UnitOfMeasure } from "../enums/UnitOfMeasure";
import { IBaseMaterialType } from "./IBaseMaterialType";
import { IFillerMaterialType } from "./IFillerMaterialType";
import { IFusionProcess } from "./IFusionProcess";
import { IJointDesign } from "./IJointDesign";
import { IStandardCode } from "./IStandardCode";

export interface IProcessSpecificationProcedure {
    id: number;
    name: number;
    jointDesign: IJointDesign;
    baseMaterial1: IBaseMaterialType;
    baseMaterial2: IBaseMaterialType;
    fusionProcess: IFusionProcess;
    fillerMaterial1: IFillerMaterialType;
    fillerMaterial2: IFillerMaterialType;
    standardCode: IStandardCode;
    isPreheatRequired: boolean;
    isPostWeldHeatTreatmentRequired: boolean;
    uom: UnitOfMeasure;
    diameterMin: number;
    diameterMax: number;
    thicknessMin: number;
    thicknessMax: number;
}