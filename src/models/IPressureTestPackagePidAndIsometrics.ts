import { ICoordinate } from "./ICoordinate";
import { IIsometric } from "./IIsometric";
import { IPid } from "./IPid";

export interface IPressureTestPackagePidAndIsometrics {
    id: number;
    pid: IPid;
    isometrics: IIsometric[];
}