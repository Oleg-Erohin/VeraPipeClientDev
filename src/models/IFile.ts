import { FileType } from "../enums/FileType";

export interface IFile{
    id?: number;
    fileType: FileType;
    resourceId: number;
    revision?: string;
    file?: File;
    uploadDate?: Date; //string?
}