import { useEffect, useState } from "react";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../models/IBaseMaterialCertificate";
import Modal from "react-modal";
import BaseMaterialCertificateEditor from "../BaseMaterialCertificateEditor/BaseMaterialCertificateEditor";
import BaseMaterialCertificateFilters from "../BaseMaterialCertificateFilters/BaseMaterialCertificateFilters";
import { IBaseMaterialCertificateFilter } from "../../filter_models/IBaseMaterialCertificate";

function BaseMaterialCertificatesList() {
  Modal.setAppElement("#root");

  const [baseMaterialCertificates, setBaseMaterialCertificates] = useState<IBaseMaterialCertificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<IBaseMaterialCertificate | null>(null);
  const [filteredCertificates, setFilteredCertificates] = useState<IBaseMaterialCertificate[]>([]);
  const [filtersModalIsOpen, setFiltersModalIsOpen] = useState(false);

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

  function openFiltersModal() {
    setFiltersModalIsOpen(true);
  }

  function closeFiltersModal() {
    setFiltersModalIsOpen(false);
  }

  async function getBaseMaterialCertificates() {
    try {
      const responseBaseMaterialCertificates = await axios.get(
        `http://localhost:8080/base-material-certificates`
      );
      const baseMaterialCertificates: IBaseMaterialCertificate[] =
        responseBaseMaterialCertificates.data;
      setBaseMaterialCertificates(baseMaterialCertificates);
      setFilteredCertificates(baseMaterialCertificates);
    } catch (error: any) {
      console.error("Error fetching base material certificates:", error);
      setIsError(true);
    }
  }

async function getFilteredBaseMaterialCertificates(filters: IBaseMaterialCertificateFilter) {
  const params: Record<string, string | string[]> = {};

  if (filters.names && filters.names.length > 0) {
    params.names = filters.names;
  }
  if (filters.heatNums && filters.heatNums.length > 0) {
    params.heatNums = filters.heatNums;
  }
  if (filters.lotNums && filters.lotNums.length > 0) {
    params.lotNums = filters.lotNums;
  }
  if (filters.baseMaterialTypes && filters.baseMaterialTypes.length > 0) {
    params.baseMaterialTypeNames = filters.baseMaterialTypes.map(type => type.name);
  }

  try {
    debugger;
    const responseBaseMaterialCertificates = await axios.get(
      `http://localhost:8080/base-material-certificates/by-filters`, 
      { params }
    );
    const tempBaseMaterialCertificates: IBaseMaterialCertificate[] = responseBaseMaterialCertificates.data;
    setFilteredCertificates(tempBaseMaterialCertificates);
  } catch (error: any) {
    console.error("Error fetching filtered base material certificates:", error);
    setIsError(true);
  }
}


  function applyFilters(filters: IBaseMaterialCertificateFilter) {
    getFilteredBaseMaterialCertificates(filters);
    closeFiltersModal();
  }

  function onEditClicked(baseMaterialCertificate: IBaseMaterialCertificate) {
    openEditModal(baseMaterialCertificate);
  }

  return (
    <div className="BaseMaterialCertificatesList">
      {baseMaterialCertificates.length > 0 ? (
        <>
          <button onClick={() => openFiltersModal()}>
            Filters
          </button>
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Heat #</td>
                <td>Lot #</td>
                <td>Material Type</td>
                <td>Edit</td>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredCertificates) && filteredCertificates.map((baseMaterialCertificate) => (
                <tr key={baseMaterialCertificate.id}>
                  <td>{baseMaterialCertificate.name}</td>
                  <td>{baseMaterialCertificate.heatNum}</td>
                  <td>{baseMaterialCertificate.lotNum}</td>
                  <td>{baseMaterialCertificate.baseMaterialType.name}</td>
                  <td>
                    <button onClick={() => onEditClicked(baseMaterialCertificate)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div>No base material certificates available</div>
      )}

      <Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal}>
        {selectedCertificate && (
          <BaseMaterialCertificateEditor baseMaterialCertificate={selectedCertificate} />
        )}
        <button onClick={closeEditModal}>Return</button>
      </Modal>

      <Modal isOpen={filtersModalIsOpen} onRequestClose={closeFiltersModal}>
        <BaseMaterialCertificateFilters
          baseMaterialCertificates={baseMaterialCertificates}
          applyFilters={applyFilters}
        />
        <button onClick={closeFiltersModal}>Return</button>
      </Modal>
    </div>
  );
}

export default BaseMaterialCertificatesList;
