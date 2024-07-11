import { IFillerMaterialType } from "./IFillerMaterialType";

export interface IFillerMaterialCertificate{
    id: number;
    heatNum: string;
    fillerMaterialType: IFillerMaterialType;
}