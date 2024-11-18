import { useEffect, useState } from "react";
import { FileType } from "../../../enums/FileType";
import axios from "axios";
import { IFile } from "../../../models/IFile";
interface IFileDownloader {
  fileType: FileType;
  resourceId: number;
  revision?: string;
  isExist: boolean;
}

function FileDownloader(props: IFileDownloader) {
  const [file, setFile] = useState<IFile | null>(null); // Start with null since file may not exist initially

  useEffect(() => {
    // Trigger file download when the file is set
    if (file) {
      downloadFile();
    }
  }, [file]); // Watch for changes in the file state

  async function getFile() {
    try {
      const response = await axios.get(`http://localhost:8080/files/get-file`, {
        params: {
          fileType: props.fileType,
          resourceId: props.resourceId,
          revision: props.revision,
        },
      });

      if (response.data.id) {
        setFile(response.data); // The downloadFile() will be called via useEffect when file state updates
      }
    } catch (error: any) {
      console.error("Error fetching File: ", error);
    }
  }

  function downloadFile() {
    if (!file) return;
    
    // Decode the Base64 string to a binary string
    const fileData = file?.file;
    if (fileData) {
      const binaryString = atob(fileData);
      const byteNumbers = new Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteNumbers[i] = binaryString.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob from the Uint8Array
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create a link element, set its href to the blob URL, and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name ? file.name : props.fileType; // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
    }
  }

  return (
    <div>
      <button onClick={getFile} disabled={!props.isExist}>Download File</button>
    </div>
  );
}

export default FileDownloader;
