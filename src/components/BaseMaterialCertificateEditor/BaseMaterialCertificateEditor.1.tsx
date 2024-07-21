import { useEffect, useState } from "react";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../models/IBaseMaterialCertificate";
import { IBaseMaterialType } from "../../models/IBaseMaterialType";
import Modal from "react-modal";
import { Notifications } from "../../enums/Notificatios";
import NotificationWindow from "../NotificationWindow/NotificationWindow";
import { IFile } from "../../models/IFile";
import { FileType } from "../../enums/FileType";
import { BaseMaterialCertificateEditorProps } from "./BaseMaterialCertificateEditor";

export function BaseMaterialCertificateEditor({
  props,
}: BaseMaterialCertificateEditorProps) {
  Modal.setAppElement("#root");

  const [isChangesMade, setIsChangesMade] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [formData, setFormData] = useState<IBaseMaterialCertificate>({
    id: props.id,
    heatNum: props.heatNum,
    lotNum: props.lotNum,
    baseMaterialType: props.baseMaterialType,
  });
  const [baseMaterialTypes, setBaseMaterialTypes] = useState<
    IBaseMaterialType[]
  >([]);
  const isNewBaseMaterialCertificate: boolean = formData.id == -1;
  const [file, setfile] = useState<IFile>();
  const [isFileChanged, setIsFileChanged] = useState<boolean>(false);
  // const selectedMaterialType = baseMaterialTypes.find(
  //   (type) => type.name == props.materialTypeName
  // );
  const [notification, setNotification] = useState<string>("");
  const [isNotificationModalOpen, setIsNotificationModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await getAllMaterialTypes();

    if (!isNewBaseMaterialCertificate) {
      await getFile();
    }

    setIsLoading(false);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching base material certificates</div>;
  }

  async function getAllMaterialTypes() {
    try {
      const responseBaseMaterialTypes = await axios.get(
        `http://localhost:8080/base-material-types`
      );
      const baseMaterialTypes = responseBaseMaterialTypes.data;
      setBaseMaterialTypes(baseMaterialTypes);
    } catch (error: any) {
      console.error("Error fetching base material types:", error);
      setIsError(true);
    }
  }

  async function getFile() {
    try {
      const response = await axios.get(
        `http://localhost:8080/files/by-filters`,
        {
          params: {
            fileType: FileType.BASE_MATERIAL_CERTIFICATE,
            resourceName: props.name,
          },
        }
      );
      const formFile: IFile = {};
    } catch (error: any) {
      console.error("Error fetching File: ", error);
    }
  }

  function inputChanged(event: any) {
    const { name, value } = event.target;

    if (name == "materialTypeName") {
      const selectedType = baseMaterialTypes.find(
        (type) => type.id == parseInt(value)
      );
      if (selectedType) {
        setFormData({
          ...formData,
          materialTypeName: selectedType.name,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setIsChangesMade(true);
  }

  async function onSaveChangesClicked() {
    try {
      if (isNewBaseMaterialCertificate) {
        await axios.post(
          `http://localhost:8080/base-material-certificates`,
          formData
        );
      } else {
        await axios.put(
          `http://localhost:8080/base-material-certificates`,
          formData
        );
      }
      if (isFileChanged) {
      }
      if (isNewBaseMaterialCertificate) {
        setNotification(Notifications.BASE_MATERIAL_CERTIFICATE_CREATE);
        setIsNotificationModalOpen(true);
      } else {
        setNotification(Notifications.BASE_MATERIAL_CERTIFICATE_UPDATE);
        setIsNotificationModalOpen(true);
      }
      window.location.reload();
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  async function onDeleteConfirmClicked() {
    try {
      await axios.delete(
        `http://localhost:8080/base-material-certificates/${formData.id}`
      );
      setNotification(Notifications.BASE_MATERIAL_CERTIFICATE_DELETE);
      setIsNotificationModalOpen(true);
      window.location.reload();
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  function handleFileChanged(event: any) {
    setfile(event.target.value);
    setIsFileChanged(true);
  }

  return (
    <div className="BaseMaterialCertificateEditor">
      {!isNewBaseMaterialCertificate && (
        <div>
          <label>Certificate #: {formData.id}</label>
        </div>
      )}
      <div>
        <label>Heat #:</label>
        <input
          type="text"
          name="heatNum"
          value={formData.heatNum}
          onChange={inputChanged}
        />
      </div>
      <div>
        <label>Lot #:</label>
        <input
          type="text"
          name="lotNum"
          value={formData.lotNum}
          onChange={inputChanged}
        />
      </div>
      <div>
        <label>Material Type:</label>
        <select
          name="materialTypeName"
          value={props.baseMaterialType ? props.baseMaterialType.id : ""}
          onChange={inputChanged}
        >
          <option value="">Select Material Type</option>
          {baseMaterialTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>{" "}
      </div>
      <div>
        {file && <p>File name: {file.revision}</p>}
        <label>File:</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChanged}
        />
      </div>
      <div>
        <button
          style={{
            cursor: isChangesMade ? "pointer" : "not-allowed", //Temp solution until CSS
          }}
          onClick={onSaveChangesClicked}
          disabled={!isChangesMade}
        >
          Save
        </button>
        {!isNewBaseMaterialCertificate && (
          <button onClick={() => setDeleteModalIsOpen(true)}>Delete</button>
        )}
      </div>
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
      >
        <label>
          Are you sure you want to delete this base material certificate?
        </label>
        <button onClick={onDeleteConfirmClicked}>Confirm</button>
        <button onClick={() => setDeleteModalIsOpen(false)}>Return</button>
      </Modal>
      <Modal isOpen={isNotificationModalOpen}>
        <NotificationWindow notification={notification} />
        <button onClick={() => setIsNotificationModalOpen(false)}>Ok</button>
      </Modal>
    </div>
  );
}