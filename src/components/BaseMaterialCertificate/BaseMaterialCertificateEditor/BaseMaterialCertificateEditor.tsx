import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../../models/IBaseMaterialCertificate";
import { IBaseMaterialType } from "../../../models/IBaseMaterialType";
import Modal from "react-modal";
import { Notifications } from "../../../enums/Notificatios";
import NotificationWindow from "../../NotificationWindow/NotificationWindow";
import { FileType } from "../../../enums/FileType";
import FileEditor, { IFileEditorPublicMethods } from "../../File/FileEditor/FileEditor";

interface BaseMaterialCertificateEditorProps {
  baseMaterialCertificate: IBaseMaterialCertificate;
}

function BaseMaterialCertificateEditor(props: BaseMaterialCertificateEditorProps) {
  Modal.setAppElement("#root");

  //Resource specific variables
  const [formData, setFormData] = useState<IBaseMaterialCertificate>({
    id: props.baseMaterialCertificate.id,
    name: props.baseMaterialCertificate.name,
    heatNum: props.baseMaterialCertificate.heatNum,
    lotNum: props.baseMaterialCertificate.lotNum,
    baseMaterialType: props.baseMaterialCertificate.baseMaterialType,
  });
  const [baseMaterialTypes, setBaseMaterialTypes] = useState<IBaseMaterialType[]>([]);
  const [isAddingNewMaterial, setIsAddingNewMaterial] = useState<boolean>(false);
  const [newBaseMaterialName, setBaseNewMaterialName] = useState<string>('');

  //Common variables
  const fileEditorRef = useRef<IFileEditorPublicMethods>(null);
  const [isChangesMade, setIsChangesMade] = useState<boolean>(false);
  const isNewResource: boolean = formData.id == -1;
  const [notification, setNotification] = useState<string>("");
  const [notificationModalIsOpen, setNotificationModalIsOpen] = useState<boolean>(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function openEditModal() {
    setEditModalIsOpen(true);
  }

  async function fetchData() {
    await getAllMaterialTypes();
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
    }
  }

  function inputChanged(event: any) {
    const { name, value } = event.target;
    if (name === "materialTypeName") {
      if (isAddingNewMaterial) {
        setBaseNewMaterialName(value);
        setFormData({ ...formData, baseMaterialType: { id: -1, name: value } });
      } else {
        const selectedType = baseMaterialTypes.find((type) => type.id === parseInt(value));
        if (selectedType) {
          setFormData({ ...formData, baseMaterialType: selectedType });
        }
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
      if (isNewResource) {
        if (isAddingNewMaterial && newBaseMaterialName) {
          const newBaseMaterialType: IBaseMaterialType = { id: -1, name: newBaseMaterialName };
          formData.baseMaterialType = newBaseMaterialType;
        }

        // Create the new base material certificate
        const response = await axios.post<number>(
          `http://localhost:8080/base-material-certificates`,
          formData
        );
        let newResourceId: number = response.data;

        if (newResourceId) {
          // Update formData with the new ID
          setFormData((prevFormData) => ({
            ...prevFormData,
            id: newResourceId,
          }));

          // Update the resource ID for the file editor
          if (fileEditorRef.current) {
            fileEditorRef.current.saveFile();
          }
        }
      } else {
        // Update the existing base material certificate
        debugger;
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
        isNewResource
          ? Notifications.BASE_MATERIAL_CERTIFICATE_CREATE
          : Notifications.BASE_MATERIAL_CERTIFICATE_UPDATE
      );
      setNotificationModalIsOpen(true);

    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  async function onDeleteConfirmClicked() {
    try {
      await axios.delete(
        `http://localhost:8080/base-material-certificates/${formData.id}`
      );

      // Show notification
      setNotification(Notifications.BASE_MATERIAL_CERTIFICATE_DELETE);
      setNotificationModalIsOpen(true);

    } catch (error: any) {
      console.error("Error occurred:", error);
      alert(error.response?.data?.errorMessage || 'Error occurred during deletion.');
    }
  }

  return (
    <div>
      <button onClick={() => openEditModal()}>
        {isNewResource ? "Add new" : "Edit"}
      </button>
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={() => {
          setEditModalIsOpen(false);
          // Reset to drop-down list
          setIsAddingNewMaterial(false);
          // Reset form data
          setFormData({
            id: props.baseMaterialCertificate.id,
            name: props.baseMaterialCertificate.name,
            heatNum: props.baseMaterialCertificate.heatNum,
            lotNum: props.baseMaterialCertificate.lotNum,
            baseMaterialType: props.baseMaterialCertificate.baseMaterialType,
          });
        }}
      >
        {!isNewResource && (
          <div>
            <h2>Edit Base Material Certificate</h2>
            <label>Certificate #: {formData.id}</label>
          </div>
        )}
        {isNewResource && (
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
          {isAddingNewMaterial ? (
            <div>
              <input
                type="text"
                name="materialTypeName"
                onChange={inputChanged}
              />
            </div>
          ) : (
            <div>
              <select
                name="materialTypeName"
                value={formData.baseMaterialType.id}
                onChange={(event) => {
                  const value = event.target.value === "Select" ? "" : event.target.value;
                  inputChanged({ target: { name: event.target.name, value } });
                }}
              >
                {formData.baseMaterialType.id == 0 && (
                  <option value="">Select Material Type</option>
                )}
                {isNewResource && <option>Select</option>}
                {baseMaterialTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <button onClick={() => setIsAddingNewMaterial(true)}>Add new</button>
            </div>
          )}
        </div>        <div>
          <FileEditor
            fileType={FileType.BASE_MATERIAL_CERTIFICATE}
            resourceId={formData.id}
            ref={fileEditorRef}
            setIsChangesMade={setIsChangesMade}
            isNewComponent={isNewResource}
          />
        </div>
        <div>
          <button
            onClick={onSaveChangesClicked}
            disabled={!isChangesMade}
          >
            Save
          </button>
          {!isNewResource && (
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
        <Modal isOpen={notificationModalIsOpen} onRequestClose={() => { setNotificationModalIsOpen(false); window.location.reload(); }}>
          <NotificationWindow notification={notification} />
          <button onClick={() => { setNotificationModalIsOpen(false); window.location.reload(); }}>Ok</button>
        </Modal>
      </Modal>
    </div>
  );
}

export default BaseMaterialCertificateEditor;
