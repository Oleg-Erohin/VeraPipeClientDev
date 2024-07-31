import { IBaseMaterialCertificate } from "../models/IBaseMaterialCertificate";

export class AppState {
    public baseMaterialCertificates: IBaseMaterialCertificate[] = [];
    public isSaveFileClicked: boolean = false;
    // public editedBaseMaterialCertificate: IBaseMaterialCertificate = {
    //     id: -1,
    //     heatNum: "",
    //     lotNum: "",
    //     materialTypeName: "",
    // }
}