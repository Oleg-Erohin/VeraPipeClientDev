import { FileType } from "../enums/FileType";

export interface IFile {
  id?: number;
  name?: string;
  strFileType: string;
  resourceId: number;
  revision?: string;
  file?: string;
  uploadDate?: Date; //string?
}
