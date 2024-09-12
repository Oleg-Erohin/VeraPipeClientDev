import { useEffect, useState } from "react";
import { FileType } from "../../enums/FileType";
import axios from "axios";
import Modal from "react-modal";

interface IFileRevisionsPage {
  fileType: FileType;
  resourceId: number;
}

function FileRevisionsPage(props: IFileRevisionsPage) {
  const [revisions, setRevisions] = useState<string[]>([]);
  const [isRevisionsModalOpen, setIsRevisionsModalOpen] =
    useState<boolean>(false);

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
    setIsRevisionsModalOpen(true);
  }

  useEffect(() => {
    if (isRevisionsModalOpen) {
      getRevisions();
    }
  });

  return (
    <div>
      <button onClick={onRevisionsClicked}>Previous Revisions</button>
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
                  <button></button>
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
