import { FileType } from "../enums/FileType";

export interface IFile{
    id?: number;
    fileType: FileType;
    resourceName: string;
    revision: string;
    file: File;
    uploadDate?: Date; //string?
}