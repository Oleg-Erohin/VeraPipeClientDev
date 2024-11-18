import { useEffect, useState } from "react";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../../models/IBaseMaterialCertificate";
import Modal from "react-modal";
import BaseMaterialCertificateEditor from "../BaseMaterialCertificateEditor/BaseMaterialCertificateEditor";
import { FileType } from "../../../enums/FileType";
import FileDownloader from "../../File/FileDownloader/FileDownloader";
import BaseMaterialCertificateFilters from "../BaseMaterialCertificateFilters/BaseMaterialCertificateFilters";
import FileRevisionsPage from "../../File/FileRevisionsPage/FileRevisionsPage";

interface IBaseMaterialCertificateWithFileData {
  baseMaterialCertificate: IBaseMaterialCertificate;
  isExist: boolean;
}

function BaseMaterialCertificatesList() {
  Modal.setAppElement("#root");
  type SortOrder = "ascending" | "descending";

  const currentFileType: FileType = FileType.BASE_MATERIAL_CERTIFICATE;

  const [baseMaterialCertificates, setBaseMaterialCertificates] = useState<IBaseMaterialCertificate[]>([]);
  const [resourceWithFileDataArray, setResourceWithFileDataArray] = useState<IBaseMaterialCertificateWithFileData[]>([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const defaultBaseMaterialCertificate: IBaseMaterialCertificate = {
    id: -1,
    name: "",
    heatNum: "",
    lotNum: "",
    baseMaterialType: {
      id: -1,
      name: "",
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to check if file exists
  async function checkIfFileExists(currentId: number) {
    try {
      const response = await axios.get(`http://localhost:8080/files/is-exist`, {
        params: {
          fileType: currentFileType,
          resourceId: currentId,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error checking file existence: ", error);
    }
  }

  async function fetchData() {
    try {
      const responseBaseMaterialCertificates = await axios.get(`http://localhost:8080/base-material-certificates`);
      const baseMaterialCertificates: IBaseMaterialCertificate[] = responseBaseMaterialCertificates.data;

      const tempArray: IBaseMaterialCertificateWithFileData[] = [];

      for (let i = 0; i < baseMaterialCertificates.length; i++) {
        const isExist = await checkIfFileExists(baseMaterialCertificates[i].id);
        let tempData: IBaseMaterialCertificateWithFileData;
        tempData = { baseMaterialCertificate: baseMaterialCertificates[i], isExist: isExist };
        tempArray.push(tempData);
      }

      setResourceWithFileDataArray(tempArray);
      setBaseMaterialCertificates(baseMaterialCertificates);
      setFilteredCertificates(baseMaterialCertificates);
    } catch (error: any) {
      console.error("Error fetching base material certificates:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching base material certificates</div>;
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

  function handleSort(column: keyof IBaseMaterialCertificate) {
    const newSortOrder =
      sortColumn === column && sortOrder === "ascending"
        ? "descending"
        : "ascending";

    const sortedCertificates = [...filteredCertificates].sort(
      (certificateA, certificateB) => {
        let valueA = certificateA[column];
        let valueB = certificateB[column];

        if (column === "baseMaterialType") {
          valueA = certificateA.baseMaterialType.name;
          valueB = certificateB.baseMaterialType.name;
        }

        if (valueA < valueB) return newSortOrder === "ascending" ? -1 : 1;
        if (valueA > valueB) return newSortOrder === "ascending" ? 1 : -1;
        return 0;
      }
    );

    setSortColumn(column);
    setSortOrder(newSortOrder);
    setFilteredCertificates(sortedCertificates);
    setCurrentPage(1);
  }

  // const indexOfLastCertificate = currentPage * itemsPerPage;
  // const indexOfFirstCertificate = indexOfLastCertificate - itemsPerPage;
  // const currentCertificates = filteredCertificates.slice(
  //   indexOfFirstCertificate,
  //   indexOfLastCertificate
  // );

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCertificates.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="BaseMaterialCertificatesList">
      <h2>Base Material Certificates</h2>
      {<BaseMaterialCertificateEditor baseMaterialCertificate={defaultBaseMaterialCertificate} />}
      {baseMaterialCertificates.length > 0 ? (
        <div>
          <button onClick={() => openFiltersModal()}>Filters</button>
          <table>
            <thead>
              <tr>
                <td onClick={() => handleSort("name")}>
                  Name{" "}
                  {sortColumn === "name" &&
                    (sortOrder === "ascending" ? "↑" : "↓")}
                </td>
                <td onClick={() => handleSort("heatNum")}>
                  Heat #{" "}
                  {sortColumn === "heatNum" &&
                    (sortOrder === "ascending" ? "↑" : "↓")}
                </td>
                <td onClick={() => handleSort("lotNum")}>
                  Lot #{" "}
                  {sortColumn === "lotNum" &&
                    (sortOrder === "ascending" ? "↑" : "↓")}
                </td>
                <td onClick={() => handleSort("baseMaterialType")}>
                  Material Type{" "}
                  {sortColumn === "baseMaterialType" &&
                    (sortOrder === "ascending" ? "↑" : "↓")}
                </td>
                <td>File</td>
                <td>Edit</td>
                <td>Previous Revisions</td>
              </tr>
            </thead>
            <tbody>
              {resourceWithFileDataArray.map(resourceWithFileData => {
                return (
                  <tr key={resourceWithFileData.baseMaterialCertificate.id}>
                    <td>{resourceWithFileData.baseMaterialCertificate.name}</td>
                    <td>{resourceWithFileData.baseMaterialCertificate.heatNum}</td>
                    <td>{resourceWithFileData.baseMaterialCertificate.lotNum}</td>
                    <td>{resourceWithFileData.baseMaterialCertificate.baseMaterialType.name}</td>
                    <td>
                      <FileDownloader
                        isExist={resourceWithFileData.isExist}
                        fileType={FileType.BASE_MATERIAL_CERTIFICATE}
                        resourceId={resourceWithFileData.baseMaterialCertificate.id}
                      />
                    </td>
                    <td>
                      <BaseMaterialCertificateEditor
                        baseMaterialCertificate={resourceWithFileData.baseMaterialCertificate}
                      />
                    </td>
                    <td>
                      <FileRevisionsPage
                        isExist={resourceWithFileData.isExist}
                        fileType={FileType.BASE_MATERIAL_CERTIFICATE}
                        resourceId={resourceWithFileData.baseMaterialCertificate.id}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of{" "}
              {Math.ceil(filteredCertificates.length / itemsPerPage)}
            </span>
            <button
              onClick={nextPage}
              disabled={
                currentPage ===
                Math.ceil(filteredCertificates.length / itemsPerPage)
              }
            >
              Next
            </button>
          </div>
        </div>
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
      <Modal isOpen={filtersModalIsOpen} onRequestClose={closeFiltersModal}>
        <BaseMaterialCertificateFilters
          baseMaterialCertificates={baseMaterialCertificates}
          onFilter={(filtered) => {
            setFilteredCertificates(filtered);
            setCurrentPage(1);
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
