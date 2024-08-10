import { IBaseMaterialType } from "./IBaseMaterialType";

export interface IBaseMaterialCertificate{
    id: number;
    name:string;
    heatNum: string;
    lotNum: string;
    baseMaterialType: IBaseMaterialType;
}