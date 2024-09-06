import { IFillerMaterialType } from "./IFillerMaterialType";

export interface IFillerMaterialCertificate{
    id: number;
    name:string;
    heatNum: string;
    fillerMaterialType: IFillerMaterialType;
}