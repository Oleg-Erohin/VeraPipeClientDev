import { ICoordinate } from "./ICoordinate";
import { IIsometric } from "./IIsometric";
import { IPid } from "./IPid";
import { IPressureTestPackagePidAndIsometrics } from "./IPressureTestPackagePidAndIsometrics";

export interface IPressureTestPackage {
    id: number;
    name: String;
    pidsAndIsometrics: IPressureTestPackagePidAndIsometrics[];
    date: Date;
}