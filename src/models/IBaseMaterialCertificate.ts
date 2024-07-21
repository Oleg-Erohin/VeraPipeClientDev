import { IBaseMaterialType } from "./IBaseMaterialType";
import { IFile } from "./IFile";

export interface IBaseMaterialCertificate{
    id: number;
    heatNum: string;
    lotNum: string;
    baseMaterialType: IBaseMaterialType;
}