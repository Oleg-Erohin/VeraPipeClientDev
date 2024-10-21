import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../../models/IBaseMaterialCertificate";
import { IBaseMaterialType } from "../../../models/IBaseMaterialType";
import Modal from "react-modal";
import { Notifications } from "../../../enums/Notificatios";
import NotificationWindow from "../../NotificationWindow/NotificationWindow";
import { IFile } from "../../../models/IFile";
import { FileType } from "../../../enums/FileType";
import FileEditor, { IFileEditorPublicMethods } from "../../File/FileEditor/FileEditor";
import { useDispatch } from "react-redux";
import { ActionType } from "../../../redux/action-type";

interface BaseMaterialCertificateEditorProps {
  baseMaterialCertificate: IBaseMaterialCertificate;
}

function BaseMaterialCertificateEditor(
  props: BaseMaterialCertificateEditorProps
) {
  Modal.setAppElement("#root");

  const fileEditorRef = useRef<IFileEditorPublicMethods>(null);
  const [isChangesMade, setIsChangesMade] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [formData, setFormData] = useState<IBaseMaterialCertificate>({
    id: props.baseMaterialCertificate.id,
    name: props.baseMaterialCertificate.name,
    heatNum: props.baseMaterialCertificate.heatNum,
    lotNum: props.baseMaterialCertificate.lotNum,
    baseMaterialType: props.baseMaterialCertificate.baseMaterialType,
  });
  const [baseMaterialTypes, setBaseMaterialTypes] = useState<IBaseMaterialType[]>([]);
  const isNewBaseMaterialCertificate: boolean = formData.id == -1;
  const [notification, setNotification] = useState<string>("");
  const [notificationModalIsOpen, setNotificationModalIsOpen] = useState<boolean>(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function openEditModal() {
    setEditModalIsOpen(true);
  }

  async function fetchData() {
    await getAllMaterialTypes();
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

  function inputChanged(event: any) {
    const { name, value } = event.target;
    if (name == "materialTypeName") {
      const selectedType = baseMaterialTypes.find((type) => type.id == parseInt(value));
      if (selectedType) {
        setFormData({ ...formData, baseMaterialType: selectedType });
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
      let baseMaterialCertificate: IBaseMaterialCertificate;

      if (isNewBaseMaterialCertificate) {
        // Create the new base material certificate
        const response = await axios.post<IBaseMaterialCertificate>(
          `http://localhost:8080/base-material-certificates`,
          formData
        );
        baseMaterialCertificate = response.data;

        if (baseMaterialCertificate && baseMaterialCertificate.id) {
          // Update formData with the new ID
          setFormData((prevFormData) => ({
            ...prevFormData,
            id: baseMaterialCertificate.id,
          }));

          // Update the resource ID for the file editor
          if (fileEditorRef.current) {
            fileEditorRef.current.saveFile();
          }
        }
      } else {
        // Update the existing base material certificate
        await axios.put(
          `http://localhost:8080/base-material-certificates`,
          formData
        );

        if (fileEditorRef.current) {
          fileEditorRef.current.saveFile();
        }
      }

      // Show notification
      setNotification(
        isNewBaseMaterialCertificate
          ? Notifications.BASE_MATERIAL_CERTIFICATE_CREATE
          : Notifications.BASE_MATERIAL_CERTIFICATE_UPDATE
      );
      setNotificationModalIsOpen(true);

      // Reload the page
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
          setNotificationModalIsOpen(true);
  
          // Reload the page after successful deletion
          window.location.reload();

    } catch (error: any) {
      console.error("Error occurred:", error);
      alert(error.response?.data?.errorMessage || 'Error occurred during deletion.');
    }
  }
  
  return (
    <div className="BaseMaterialCertificateEditor">
      <button onClick={() => openEditModal()}>
        {isNewBaseMaterialCertificate ? "Add new" : "Edit"}
      </button>
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={() => setEditModalIsOpen(false)}
      >
        {!isNewBaseMaterialCertificate && (
          <div>
            <h2>Edit Base Material Certificate</h2>
            <label>Certificate #: {formData.id}</label>
          </div>
        )}
        {isNewBaseMaterialCertificate && (
          <h2>Create Base Material Certificates</h2>
        )}
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={inputChanged}
          />
        </div>
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
            value={formData.baseMaterialType.id}
            onChange={inputChanged}
          >
            {formData.baseMaterialType.id == 0 && (
              <option value="">Select Material Type</option>
            )}
            {isNewBaseMaterialCertificate && <option>Select</option>}
            {baseMaterialTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>{" "}
        </div>
        <div>
          <FileEditor
            fileType={FileType.BASE_MATERIAL_CERTIFICATE}
            resourceId={formData.id}
            ref={fileEditorRef}
            setIsChangesMade={setIsChangesMade}
            isNewComponent={isNewBaseMaterialCertificate}
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
        <Modal isOpen={notificationModalIsOpen}>
          <NotificationWindow notification={notification} />
          <button onClick={() => setNotificationModalIsOpen(false)}>Ok</button>
        </Modal>
      </Modal>
    </div>
  );
}

export default BaseMaterialCertificateEditor;
