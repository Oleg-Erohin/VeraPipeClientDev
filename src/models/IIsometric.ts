import { IIsometricLocationInPid } from "./IIsometricLocationInPid";

export interface IIsometric {
    id: number;
    name: string;
    revision: string;
    date: Date;
    sheets: number;
    isometricLocationsInPids: IIsometricLocationInPid[];
    isApproved: boolean;
    comments: string;
}