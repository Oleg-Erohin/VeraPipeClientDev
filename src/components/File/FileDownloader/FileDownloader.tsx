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
  const [file, setFile] = useState<IFile>(); // Start with null since file may not exist initially

  useEffect(() => {
    // Trigger file download when the file is set
    if (file) {
      // downloadFile();
      openPdfInNewTab();
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

  function openPdfInNewTab() {
    if (file && file.file) {
  // Convert the base64 string to a byte array
  const byteCharacters = atob(file.file);
  const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob object from the byte array
  const blob = new Blob([byteArray], { type: "application/pdf" });

  // Create an object URL from the Blob
  const blobUrl = URL.createObjectURL(blob);

  // Try using window.open directly with the blobUrl (Chrome may still download)
  const newTab = window.open(blobUrl, '_blank');
  if (!newTab) {
    alert("Please allow popups for this website.");
  }

  // Revoke the object URL after a short delay to avoid memory leaks
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }
  }

  return (
    <div>
      <button onClick={getFile} disabled={!props.isExist}>Open</button>
    </div>
  );
}

export default FileDownloader;
