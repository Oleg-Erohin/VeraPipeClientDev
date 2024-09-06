import { ICoordinate } from "./ICoordinate";
import { IPid } from "./IPid";

export interface IIsometricLocationInSheet{
    id: number;
    sheet: number;
    coordinateOnSheet: ImportCallOptions[];
}