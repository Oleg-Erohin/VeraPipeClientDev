import { useEffect, useState } from "react";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../models/IBaseMaterialCertificate";
import Modal from "react-modal";
import BaseMaterialCertificateEditor from "../BaseMaterialCertificateEditor/BaseMaterialCertificateEditor";
import BaseMaterialCertificateFilters from "../BaseMaterialCertificateFilters/BaseMaterialCertificateFilters";


function BaseMaterialCertificatesList() {
  Modal.setAppElement("#root");
  type SortOrder = "ascending" | "descending";

  const [baseMaterialCertificates, setBaseMaterialCertificates] = useState<IBaseMaterialCertificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [filtersModalIsOpen, setFiltersModalIsOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<IBaseMaterialCertificate | null>(null);
  const [filteredCertificates, setFilteredCertificates] = useState<IBaseMaterialCertificate[]>([]);

  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedHeatNums, setSelectedHeatNums] = useState<string[]>([]);
  const [selectedLotNums, setSelectedLotNums] = useState<string[]>([]);
  const [selectedBaseMaterialTypes, setSelectedBaseMaterialTypes] = useState<string[]>([]);

  const [sortColumn, setSortColumn] = useState<keyof IBaseMaterialCertificate | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("ascending");

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

  function onEditClicked(baseMaterialCertificate: IBaseMaterialCertificate) {
    openEditModal(baseMaterialCertificate);
  }

  function handleSort(column: keyof IBaseMaterialCertificate) {
    const newSortOrder = sortColumn === column && sortOrder === "ascending" ? "descending" : "ascending";

    const sortedCertificates = [...filteredCertificates].sort((certificateA, certificateB) => {
      let valueA = certificateA[column];
      let valueB = certificateB[column];

      if (column === "baseMaterialType") {
        valueA = certificateA.baseMaterialType.name;
        valueB = certificateB.baseMaterialType.name;
      }

      if (valueA < valueB) return newSortOrder === "ascending" ? -1 : 1;
      if (valueA > valueB) return newSortOrder === "ascending" ? 1 : -1;
      return 0;
    });

    setSortColumn(column);
    setSortOrder(newSortOrder);
    setFilteredCertificates(sortedCertificates);
  }

  return (
    <div className="BaseMaterialCertificatesList">
      {baseMaterialCertificates.length > 0 ? (
        <>
          <button onClick={() => openFiltersModal()}>Filters</button>
          <table>
            <thead>
              <tr>
                <td onClick={() => handleSort("name")}>
                  Name {sortColumn === "name" && (sortOrder === "ascending" ? "↑" : "↓")}
                </td>
                <td onClick={() => handleSort("heatNum")}>
                  Heat # {sortColumn === "heatNum" && (sortOrder === "ascending" ? "↑" : "↓")}
                </td>
                <td onClick={() => handleSort("lotNum")}>
                  Lot # {sortColumn === "lotNum" && (sortOrder === "ascending" ? "↑" : "↓")}
                </td>
                <td onClick={() => handleSort("baseMaterialType")}>
                  Material Type {sortColumn === "baseMaterialType" && (sortOrder === "ascending" ? "↑" : "↓")}
                </td>
                <td>Edit</td>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((baseMaterialCertificate) => (
                <tr key={baseMaterialCertificate.id}>
                  <td>{baseMaterialCertificate.name}</td>
                  <td>{baseMaterialCertificate.heatNum}</td>
                  <td>{baseMaterialCertificate.lotNum}</td>
                  <td>{baseMaterialCertificate.baseMaterialType.name}</td>
                  <td>
                    <button onClick={() => onEditClicked(baseMaterialCertificate)}>Edit</button>
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
          onFilter={(filtered) => {
            setFilteredCertificates(filtered);
            closeFiltersModal();
          }}
          selectedNames={selectedNames}
          setSelectedNames={setSelectedNames}
          selectedHeatNums={selectedHeatNums}
          setSelectedHeatNums={setSelectedHeatNums}
          selectedLotNums={selectedLotNums}
          setSelectedLotNums={setSelectedLotNums}
          selectedBaseMaterialTypes={selectedBaseMaterialTypes}
          setSelectedBaseMaterialTypes={setSelectedBaseMaterialTypes}
        />
        <button onClick={closeFiltersModal}>Return</button>
      </Modal>
    </div>
  );
}

export default BaseMaterialCertificatesList;
