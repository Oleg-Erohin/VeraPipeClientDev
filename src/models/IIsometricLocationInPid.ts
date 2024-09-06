import { ICoordinate } from "./ICoordinate";
import { IIsometric } from "./IIsometric";
import { IIsometricLocationInSheet } from "./IIsometricLocationInSheet";
import { IPid } from "./IPid";

export interface IIsometricLocationInPid{
    id: number;
    isometric: IIsometric;
    pid: IPid;
    isometricLocationsInSheets: IIsometricLocationInSheet[];
}