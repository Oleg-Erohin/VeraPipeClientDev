import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../models/IBaseMaterialCertificate";
import { IBaseMaterialType } from "../../models/IBaseMaterialType";
import Modal from "react-modal";
import { Notifications } from "../../enums/Notificatios";
import NotificationWindow from "../NotificationWindow/NotificationWindow";
import { IFile } from "../../models/IFile";
import { FileType } from "../../enums/FileType";
import FileEditor, { IFileEditorPublicMethods } from "../FileEditor/FileEditor";
import { useDispatch } from "react-redux";
import { ActionType } from "../../redux/action-type";

interface BaseMaterialCertificateEditorProps {
  baseMaterialCertificate: IBaseMaterialCertificate;
}

function BaseMaterialCertificateEditor(
  props: BaseMaterialCertificateEditorProps
) {
  Modal.setAppElement("#root");

  const dispatch = useDispatch(); // Redux dispatch to update the state
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
  const [baseMaterialTypes, setBaseMaterialTypes] = useState<
    IBaseMaterialType[]
  >([]);
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
      const selectedType = baseMaterialTypes.find(
        (type) => type.id == parseInt(value)
      );
      if (selectedType) {
        setFormData({
          ...formData,
          baseMaterialType: selectedType,
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
        const baseMaterialCertificate = await axios.post<IBaseMaterialCertificate>(
          `http://localhost:8080/base-material-certificates`,
          formData
        );

        if (baseMaterialCertificate && baseMaterialCertificate.data.id) {
          // Update formData with the new ID
          setFormData({ ...formData, id: baseMaterialCertificate.data.id });

          // Dispatch action to update the AppState with the new ID
          dispatch({
            type: ActionType.UpdateNewCreatedComponentId,
            payload: baseMaterialCertificate.data.id,
          });
        }
      } else {
        await axios.put(
          `http://localhost:8080/base-material-certificates`,
          formData
        );
      }
      // if(isFileChanged){
      //   await axios.post(
      //     `http://localhost:8080/files`,
      //     file
      //   );
      if (fileEditorRef.current) {
        fileEditorRef.current.saveFile();
      }
      if (isNewBaseMaterialCertificate) {
        setNotification(Notifications.BASE_MATERIAL_CERTIFICATE_CREATE);
        setNotificationModalIsOpen(true);
      } else {
        setNotification(Notifications.BASE_MATERIAL_CERTIFICATE_UPDATE);
        setNotificationModalIsOpen(true);
      }
      window.location.reload();
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  }

  // function saveFile() {
  //   const isSaveClicked: boolean = true;
  // }

  async function onDeleteConfirmClicked() {
    try {
      await axios.delete(
        `http://localhost:8080/base-material-certificates/${formData.id}`
      );
      setNotification(Notifications.BASE_MATERIAL_CERTIFICATE_DELETE);
      setNotificationModalIsOpen(true);
      window.location.reload();
    } catch (error: any) {
      alert(error.response.data.errorMessage);
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
            resourceId={props.baseMaterialCertificate.id}
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
