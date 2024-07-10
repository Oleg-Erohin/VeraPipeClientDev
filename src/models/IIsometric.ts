import { ICoordinate } from "./ICoordinate";

export interface IIsometric{
    id: number;
    name: string;
    pidsAndSheets: Map<string,number[]>;
    revision: string;
    date: Date;
    sheets: number;
    coordinatesInPid: ICoordinate[];
    isApproved: boolean;
    comments: string;
}