import axios from "axios";
import { FileType } from "../../../enums/FileType";
import { IFile } from "../../../models/IFile";
import { Ref, useEffect, useState } from "react";
import React, { forwardRef, useImperativeHandle } from "react";
import PdfViewer from "../../PDFViewer/PDFViewer";

export interface IFileEditorPublicMethods {
  saveFile: () => void;
  validateFileData: () => void;
}
interface IFileEditor {
  fileType: FileType;
  resourceId: number;
  revision?: string;
  setIsChangesMade?: Function;
  isNewComponent?: boolean;
}

function FileEditor(props: IFileEditor, ref: Ref<IFileEditorPublicMethods>) {
  const [fileForm, setFileForm] = useState<IFile>({
    strFileType: props.fileType,
    resourceId: props.resourceId,
  });
  const [newFileForm, setNewFileForm] = useState<IFile>({
    strFileType: props.fileType,
    resourceId: props.resourceId,
  });
  const [revisions, setRevisions] = useState<string[]>([]);
  const [isValidRevision, setIsValidRevision] = useState<boolean>(false);
  const isNewComponent = props.isNewComponent;

  // Effect to update newFileForm when resourceId changes
  useEffect(() => {
    setNewFileForm((prevState) => ({
      ...prevState,
      resourceId: props.resourceId, // Update resourceId in newFileForm
    }));
  }, [props.resourceId]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!props.isNewComponent && newFileForm.resourceId) {
      saveFile();
    }
  }, [newFileForm.resourceId]); // This triggers when resourceId is updated  

  function fetchData() {
    if (!isNewComponent) {
      getFileData();
      // getRevisions();
    }
  }

  async function getFileData() {
    try {
      const response = await axios.get(`http://localhost:8080/files/get-data`, {
        params: {
          fileType: props.fileType,
          resourceId: props.resourceId,
          revision: props.revision,
        },
      });
      if (response.data.id) {
        setFileForm(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching File: ", error);
    }
  }

  function fileChanged(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64PDF = event.target?.result as string;
        const newPDFData = base64PDF.split(",")[1];
        setNewFileForm({ ...newFileForm, file: newPDFData, name: file.name });
      };
      reader.readAsDataURL(file);
    }
    if (props.setIsChangesMade) {
      props.setIsChangesMade(true);
    }
  }

  function revisionChanged(event: any) {
    setNewFileForm({ ...newFileForm, revision: event.target.value });
    if (props.setIsChangesMade) {
      props.setIsChangesMade(true);
    }
    if (newFileForm.revision == "") {
      setIsValidRevision(false);
    } else {
      setIsValidRevision(true);
    }
  }

  async function saveFile() {
    if (validateFileData() && newFileForm.file) {
      try {
        await axios.post(`http://localhost:8080/files`, newFileForm);
      } catch {
        console.log("can't save file");
      }
    } else {
      // error
    }
  }

  function validateFileData() {
    if (isValidRevision == false) {
      return false;
    }
    if (!newFileForm.file) {
      return false;
    }
    return true;
  }

  // Expose only specific functions to the parent
  useImperativeHandle(ref, () => ({
    saveFile,
    validateFileData
  }));

  // For testing PDFViewer component only, after testing delete the next section until the "return"
  const [file, setFile] = useState<IFile>({
    strFileType: props.fileType,
    resourceId: props.resourceId,
  });
  const [fileBase64, setFileBase64] = useState<string>("");
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
        setFile(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching File: ", error);
    }
  }
  const [isFileShown, setIsFileShown] = useState<boolean>(false);
  useEffect(() => {
    if (file?.file) {
      setFileBase64(file.file);
      setIsFileShown(true);
    }
  }, [file]);

  return (
    <div>
      <div>
        {fileForm.revision && (
          <text>Current File revision: {fileForm.revision}</text>
        )}
      </div>
      <div>
        <br />
        <label>New File:</label>
        <br />
        <input type="file" accept="application/pdf" onChange={fileChanged} />
        <input
          type="text"
          placeholder="Enter Revision"
          onChange={revisionChanged}
        />
      </div>
      {!isNewComponent && revisions.length > 1 && (
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
      {!isNewComponent && (
        <div>
          <button onClick={getFile}>show PDF</button>
          {isFileShown && <PdfViewer pdfBase64={fileBase64} />}
        </div>
      )}
    </div>
  );
}

export default forwardRef(FileEditor);
