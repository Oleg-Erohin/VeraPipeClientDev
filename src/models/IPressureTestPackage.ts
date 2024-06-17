import { ICoordinate } from "./ICoordinate";

export interface IPressureTestPackage {
    id: number;
    name: number;
    pidNames: String[];
    isometricNames: String[];
    coordinatesInPidsList: ICoordinate[]
    date: Date;
}