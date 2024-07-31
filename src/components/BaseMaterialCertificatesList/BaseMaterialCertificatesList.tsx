import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ActionType } from "../../redux/action-type";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../models/IBaseMaterialCertificate";
import { AppState } from "../../redux/app-state";
import Modal from "react-modal";
import BaseMaterialCertificateEditor from "../BaseMaterialCertificateEditor/BaseMaterialCertificateEditor";

function BaseMaterialCertificatesList() {
  Modal.setAppElement("#root");

  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const baseMaterialCertificates: IBaseMaterialCertificate[] = useSelector(
  //   (state: AppState) => state.baseMaterialCertificates
  // );
  const [baseMaterialCertificates, setBaseMaterialCertificates2] = useState<IBaseMaterialCertificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<IBaseMaterialCertificate | null>(null);

  useEffect(() => {
    fetchData();
    setIsLoading(false);
  }, []);

  async function fetchData() {
    await getBaseMaterialCertificates();
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching base material certificates</div>;
  }

  function openEditModal(baseMaterialCertificate: IBaseMaterialCertificate) {
    setSelectedCertificate(baseMaterialCertificate);
    setEditModalIsOpen(true);
  }

  function closeEditModal() {
    setEditModalIsOpen(false);
    setSelectedCertificate(null);
  }

  async function getBaseMaterialCertificates() {
    try {
      const responseBaseMaterialCertificates = await axios.get(
        `http://localhost:8080/base-material-certificates`
      );
      const baseMaterialCertificates: IBaseMaterialCertificate[] =
        responseBaseMaterialCertificates.data;
      debugger;
      setBaseMaterialCertificates2(baseMaterialCertificates);
      // dispatch({
      //   type: ActionType.UpdateBaseMaterialCertificates,
      //   payload: { baseMaterialCertificates: baseMaterialCertificates },
      // });
    } catch (error: any) {
      console.error("Error fetching base material certificates:", error);
      setIsError(true);
    }
  }

  // function onEditClicked(id: number) {
  //     const editedBaseMaterialCertificate = baseMaterialCertificates.find(baseMaterialCertificate => baseMaterialCertificate.id === id);
  //     if (editedBaseMaterialCertificate) {
  //         dispatch({
  //             type: ActionType.EditBaseMaterialCertificate,
  //             payload: { editedBaseMaterialCertificate: editedBaseMaterialCertificate }
  //         });
  //         navigate(`/base_material_certificate_editor?Id=${id}`);
  //     }
  // };

  function onEditClicked(baseMaterialCertificate: IBaseMaterialCertificate) {
    openEditModal(baseMaterialCertificate);
  }

  return (
    <div className="BaseMaterialCertificatesList">
      {baseMaterialCertificates.length > 0 ? (
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Heat #</td>
              <td>Lot #</td>
              <td>Material Type</td>
              <td>Edit</td>
            </tr>
          </thead>
          <tbody>
            {baseMaterialCertificates.map((baseMaterialCertificate) => (
              <tr key={baseMaterialCertificate.id}>
                <td>{baseMaterialCertificate.id}</td>
                <td>{baseMaterialCertificate.heatNum}</td>
                <td>{baseMaterialCertificate.lotNum}</td>
                <td>{baseMaterialCertificate.baseMaterialType.name}</td>
                <td>
                  <button
                    onClick={() => onEditClicked(baseMaterialCertificate)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No base material certificates available</div>
      )}

      <Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal}>
        {selectedCertificate && (
          <BaseMaterialCertificateEditor
            baseMaterialCertificate={selectedCertificate}
          />
        )}
        <button onClick={closeEditModal}>Return</button>
      </Modal>
    </div>
  );
}

export default BaseMaterialCertificatesList;
