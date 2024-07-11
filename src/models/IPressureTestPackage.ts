import { ICoordinate } from "./ICoordinate";
import { IIsometric } from "./IIsometric";
import { IPid } from "./IPid";

export interface IPressureTestPackage {
    id: number;
    name: number;
    pids: IPid[];
    isometrics: IIsometric[];
    coordinatesInPidsList: ICoordinate[];
    date: Date;
}