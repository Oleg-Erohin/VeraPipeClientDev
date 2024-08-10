import { IBaseMaterialType } from "../models/IBaseMaterialType";

export interface IBaseMaterialCertificateFilter{
    names:string[];
    heatNums: string[];
    lotNums: string[];
    baseMaterialTypes: IBaseMaterialType[];
}