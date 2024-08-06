import { IBaseMaterialType } from "./IBaseMaterialType";
import { IFile } from "./IFile";

export interface IBaseMaterialCertificate{
    id: number;
    name:string;
    heatNum: string;
    lotNum: string;
    baseMaterialType: IBaseMaterialType;
}