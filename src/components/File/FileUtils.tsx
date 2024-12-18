import axios from "axios";
import { FileType } from "../../enums/FileType";

export async function checkIfFileExists(currentFileType: FileType, currentId: number) {
    try {
        const response = await axios.get(`http://localhost:8080/files/is-exist`, {
            params: {
                fileType: currentFileType,
                resourceId: currentId,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error checking file existence: ", error);
    }
}