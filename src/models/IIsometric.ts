import { ICoordinate } from "./ICoordinate";
import { IPid } from "./IPid";

export interface IIsometric{
    id: number;
    name: string;
    pidsAndSheets: Map<IPid,number[]>;
    revision: string;
    date: Date;
    sheets: number;
    coordinatesInPid: ICoordinate[];
    isApproved: boolean;
    comments: string;
}