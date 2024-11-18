import { useEffect, useState } from "react";
import { FileType } from "../../../enums/FileType";
import axios from "axios";
import Modal from "react-modal";
import { IFile } from "../../../models/IFile";
import FileDownloader from "../FileDownloader/FileDownloader";

interface IFileRevisionsPage {
  fileType: FileType;
  resourceId: number;
  isExist: boolean;
}

function FileRevisionsPage(props: IFileRevisionsPage) {
  const [revisions, setRevisions] = useState<string[]>([]);
  const [isRevisionsModalOpen, setIsRevisionsModalOpen] = useState<boolean>(false);



  // Fetch revisions on component mount
  useEffect(() => {
    if (props.isExist) {
      getRevisions()
    }; // Call the function on mount
  }, [props.fileType, props.resourceId]); // Only refetch if props change

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
      console.error("Error fetching revisions: ", error);
    }
  }

  function onRevisionsClicked() {
    getRevisions();
    setIsRevisionsModalOpen(true);
  }

  return (
    <div>
      <button
        onClick={onRevisionsClicked}
        disabled={!props.isExist}
      >
        Revisions
      </button>
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
                  <FileDownloader
                    isExist={props.isExist}
                    fileType={props.fileType}
                    resourceId={props.resourceId}
                    revision={revision}
                  />
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
