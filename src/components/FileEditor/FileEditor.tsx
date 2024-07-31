import axios from "axios";
import { FileType } from "../../enums/FileType";
import { IFile } from "../../models/IFile";
import { Ref, useEffect, useState } from "react";
import React, { forwardRef, useImperativeHandle } from "react";

export interface IFileEditorPublicMethods {
  saveFile: () => void;
}
interface IFileEditor {
  fileType: FileType;
  resourceId: number;
  revision?: string;
}

function FileEditor(props: IFileEditor, ref: Ref<IFileEditorPublicMethods>) {
  const [fileForm, setFileForm] = useState<IFile>({
    fileType: props.fileType,
    resourceId: props.resourceId,
  });
  const [revisions, setRevisions] = useState<string[]>();
  const [revision, setRevision] = useState<string>(props.revision || "");
  const [isValidRevision, setIsValidRevision] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    getFile();
    getRevisions();
  }

  async function getFile() {
    try {
      const response = await axios.get(`http://localhost:8080/files`, {
        params: {
          fileType: props.fileType,
          resourceId: props.resourceId,
          revision: revision,
        },
      });
      setFileForm(response.data);
      if (response.data.revision) {
        setRevision(response.data.revision);
      }
    } catch (error: any) {
      console.error("Error fetching File: ", error);
    }
  }

  async function getRevisions() {
    try {
      const response = await axios.get(
        `http://localhost:8080/files/revisions`,
        {
          params: {
            fileType: props.fileType,
            resourceId: props.resourceId,
          },
        }
      );
      setRevisions(response.data);
    } catch (error: any) {
      console.error("Error fetching revisions: ", error);
    }
  }

  function fileChanged(event: any) {
    setFileForm({ ...fileForm, file: event.target.files[0] });
  }

  function revisionChanged(event: any) {
    setRevision(event.target.value);
    if (revision == "") {
      setIsValidRevision(false);
    } else {
      setIsValidRevision(true);
    }
    setFileForm({ ...fileForm, revision: revision });
  }

  async function saveFile() {
    if (validateFileData()) {
      await axios.post(`http://localhost:8080/files`, fileForm);
    }
    else{
      // error
    }
  }

  function validateFileData() {
    if (isValidRevision == false) {
      return false;
    }
    if (!fileForm.file) {
      return false;
    }
    return true;
  }
  // Expose only specific functions to the parent
  useImperativeHandle(ref, () => ({
    saveFile,
  }));

  return (
    <div>
      <div>{fileForm.revision && <p>File revision: {fileForm.revision}</p>}</div>
      <div>
        <label>New File:</label>
        <input type="file" accept="application/pdf" onChange={fileChanged} />
        <input
          type="text"
          placeholder="Enter Revision"
          onChange={revisionChanged}
        />
      </div>
      {revisions && (
        <div>
          <label>Previous Revisions: </label>
          <select name="revisions">
            {revisions &&
              revisions.map((revision) => (
                <option key={revision} value={revision}>
                  {revision}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
}
export default forwardRef(FileEditor);
