import { UnitOfMeasure } from "../enums/UnitOfMeasure";
import { IBaseMaterialType } from "./IBaseMaterialType";
import { IFusionProcess } from "./IFusionProcess";
import { IJointDesign } from "./IJointDesign";

export interface IJoiner{
    id: number;
    tagId: string;
    uom: UnitOfMeasure;
    certifiedDiameterMin: number;
    certifiedDiameterMax: number;
    maxDepositedMaterial: number;
    baseMaterialType1: IBaseMaterialType;
    baseMaterialType2: IBaseMaterialType;
    jointDesign: IJointDesign;
    fusionProcess: IFusionProcess;
}