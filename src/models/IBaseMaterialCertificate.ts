import { IBaseMaterialType } from "./IBaseMaterialType";

export interface IBaseMaterialCertificate{
    id: number;
    heatNum: string;
    lotNum: string;
    baseMaterialType: IBaseMaterialType;
}