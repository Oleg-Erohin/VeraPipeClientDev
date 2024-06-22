import { ICoordinate } from "./ICoordinate";

export interface IIsometric{
    id: number;
    name: string;
    pidsAndSheets: Map<string,number[]>;
    revision: string;
    date: Date; // string?
    sheets: number;
    coordinatesInPid: ICoordinate[];
    isApproved: boolean;
    comments: string;
}