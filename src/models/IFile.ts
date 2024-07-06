import { FileType } from "../enums/FileType";

export interface IFile{
    id: number;
    fileType: FileType;
    resourceName: string;
    revision: string;
    file: string;
    uploadDate: Date; //string?
}