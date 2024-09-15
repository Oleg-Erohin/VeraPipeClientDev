import { useEffect, useState } from "react";
import { FileType } from "../../enums/FileType";
import axios from "axios";
import Modal from "react-modal";
import { IFile } from "../../models/IFile";

interface IFileRevisionsPage {
  fileType: FileType;
  resourceId: number;
}

function FileRevisionsPage(props: IFileRevisionsPage) {
  const [revisions, setRevisions] = useState<string[]>([]);
  const [isRevisionsModalOpen, setIsRevisionsModalOpen] =
    useState<boolean>(false);

  const [file, setFile] = useState<IFile>({
    strFileType: props.fileType,
    resourceId: props.resourceId,
  });

  async function getFile() {
    try {
      const response = await axios.get(`http://localhost:8080/files/get-file`, {
        params: {
          fileType: props.fileType,
          resourceId: props.resourceId,
          revision: file.revision,
        },
      });

      debugger;
      if (response.data.id) {
        setFile(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching File: ", error);
    }
  }

  async function getRevisions() {
    try {
      const response = await axios.get(
        `http://localhost:8080/files/get-revisions`,
        {
          params: {
            fileType: props.fileType,
            resourceId: props.resourceId,
          },
        }
      );
      if (response.data) {
        setRevisions(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching File: ", error);
    }
  }

  function onRevisionsClicked() {
    getRevisions();
    setIsRevisionsModalOpen(true);
  }

  function GetAndOpenPdfInNewTab(revision: string) {
    setFile({ ...file, revision: revision });
    getFile();
    openPdfInNewTab();
  }

  function openPdfInNewTab() {
    if (file.file) {
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
      <button onClick={onRevisionsClicked}>Revisions</button>
      <Modal
        isOpen={isRevisionsModalOpen}
        onRequestClose={() => setIsRevisionsModalOpen(false)}
      >
        <table>
          <thead>
            <tr>
              <td>Revision</td>
              <td>File</td>
            </tr>
          </thead>
          <tbody>
            {revisions.map((revision) => (
              <tr>
                <td>{revision}</td>
                <td>
                  <button onClick={() => GetAndOpenPdfInNewTab(revision)}>
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}

export default FileRevisionsPage;
