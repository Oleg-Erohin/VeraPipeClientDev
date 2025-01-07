import { useEffect, useState } from "react";
import axios from "axios";
import { IBaseMaterialCertificate } from "../../../models/IBaseMaterialCertificate";
import Modal from "react-modal";
import BaseMaterialCertificateEditor from "../BaseMaterialCertificateEditor/BaseMaterialCertificateEditor";
import { FileType } from "../../../enums/FileType";
import FileDownloader from "../../File/FileDownloader/FileDownloader";
import BaseMaterialCertificateFilters from "../BaseMaterialCertificateFilters/BaseMaterialCertificateFilters";
import FileRevisionsPage from "../../File/FileRevisionsPage/FileRevisionsPage";
import Pagination from "../../Pagination/Pagination";
import { SortOrder } from "../../../enums/SortOrder";
import { checkIfFileExists } from "../../File/FileUtils";

interface IBaseMaterialCertificateWithFileData {
  baseMaterialCertificate: IBaseMaterialCertificate;
  isFileExist: boolean;
}

function BaseMaterialCertificatesList() {
  Modal.setAppElement("#root");

  //Resource Specific Variables
  const currentFileType: FileType = FileType.BASE_MATERIAL_CERTIFICATE;
  const [baseMaterialCertificates, setBaseMaterialCertificates] = useState<IBaseMaterialCertificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<IBaseMaterialCertificate | null>(null);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedHeatNums, setSelectedHeatNums] = useState<string[]>([]);
  const [selectedLotNums, setSelectedLotNums] = useState<string[]>([]);
  const [selectedBaseMaterialTypes, setSelectedBaseMaterialTypes] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof IBaseMaterialCertificate | null>(null);
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

  //Common variables with resource specific types
  const [resourcesWithFileData, setResourcesWithFileData] = useState<IBaseMaterialCertificateWithFileData[]>([]);
  const [filteredResources, setFilteredResources] = useState<IBaseMaterialCertificate[]>([]);
  const [filteredResourcesWithFileData, setFilteredResourcesWithFileData] = useState<IBaseMaterialCertificateWithFileData[]>([]);

  //Common variables
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Ascending);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);

  //Pagination variables
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredResourcesWithFileData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredResourcesWithFileData.length / itemsPerPage);

  //When the component is mounted, fetch data
  useEffect(() => {
    fetchData();
  }, []);

  //When the filtered resources change, update the resources presented in the table
  useEffect(() => {
    const updatedFilteredResourceWithFileDataArray: IBaseMaterialCertificateWithFileData[] = resourcesWithFileData.filter(resource =>
      filteredResources.some(certificate => certificate.id === resource.baseMaterialCertificate.id)
    );
    setFilteredResourcesWithFileData(updatedFilteredResourceWithFileDataArray);
  }, [filteredResources, resourcesWithFileData]);

  async function fetchData() {
    try {
      const responseBaseMaterialCertificates = await axios.get(`http://localhost:8080/base-material-certificates`);
      const baseMaterialCertificates: IBaseMaterialCertificate[] = responseBaseMaterialCertificates.data;

      const tempArray: IBaseMaterialCertificateWithFileData[] = [];

      for (let i = 0; i < baseMaterialCertificates.length; i++) {
        const isExist = await checkIfFileExists(currentFileType, baseMaterialCertificates[i].id);
        let tempData: IBaseMaterialCertificateWithFileData;
        tempData = { baseMaterialCertificate: baseMaterialCertificates[i], isFileExist: isExist };
        tempArray.push(tempData);
      }

      setResourcesWithFileData(tempArray);
      setBaseMaterialCertificates(baseMaterialCertificates);
      setFilteredResources(baseMaterialCertificates);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    setSelectedCertificate(null);
  }

  function openFiltersModal() {
    setIsFiltersModalOpen(true);
  }

  function closeFiltersModal() {
    setIsFiltersModalOpen(false);
  }

  function handleSort(column: keyof IBaseMaterialCertificate) {
    const newSortOrder =
      sortColumn === column && sortOrder === SortOrder.Ascending
        ? SortOrder.Descending
        : SortOrder.Ascending;

    const sortedResources = [...filteredResourcesWithFileData].sort(
      (resourceA, resourceB) => {
        let valueA = resourceA.baseMaterialCertificate[column];
        let valueB = resourceB.baseMaterialCertificate[column];

        if (column === "baseMaterialType") {
          valueA = resourceA.baseMaterialCertificate.baseMaterialType.name;
          valueB = resourceB.baseMaterialCertificate.baseMaterialType.name;
        }

        if (valueA < valueB) return newSortOrder === SortOrder.Ascending ? -1 : 1;
        if (valueA > valueB) return newSortOrder === SortOrder.Ascending ? 1 : -1;
        return 0;
      }
    );

    setSortColumn(column);
    setSortOrder(newSortOrder);
    setFilteredResourcesWithFileData(sortedResources);
    setCurrentPage(1);
  }

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
                  Name
                  {sortColumn === "name" &&
                    (sortOrder === SortOrder.Ascending ? "↑" : "↓")}
                </td>
                <td onClick={() => handleSort("heatNum")}>
                  Heat #
                  {sortColumn === "heatNum" &&
                    (sortOrder === SortOrder.Ascending ? "↑" : "↓")}
                </td>
                <td onClick={() => handleSort("lotNum")}>
                  Lot #
                  {sortColumn === "lotNum" &&
                    (sortOrder === SortOrder.Ascending ? "↑" : "↓")}
                </td>
                <td onClick={() => handleSort("baseMaterialType")}>
                  Material Type
                  {sortColumn === "baseMaterialType" &&
                    (sortOrder === SortOrder.Ascending ? "↑" : "↓")}
                </td>
                <td>File</td>
                <td>Edit</td>
                <td>Previous Revisions</td>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(resourceWithFileData => {
                return (
                  <tr key={resourceWithFileData.baseMaterialCertificate.id}>
                    <td>{resourceWithFileData.baseMaterialCertificate.name}</td>
                    <td>{resourceWithFileData.baseMaterialCertificate.heatNum}</td>
                    <td>{resourceWithFileData.baseMaterialCertificate.lotNum}</td>
                    <td>{resourceWithFileData.baseMaterialCertificate.baseMaterialType.name}</td>
                    <td>
                      <FileDownloader
                        isExist={resourceWithFileData.isFileExist}
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
                        isExist={resourceWithFileData.isFileExist}
                        fileType={FileType.BASE_MATERIAL_CERTIFICATE}
                        resourceId={resourceWithFileData.baseMaterialCertificate.id}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div>No base material certificates available</div>
      )}

      <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal}>
        {selectedCertificate && (
          <BaseMaterialCertificateEditor
            baseMaterialCertificate={selectedCertificate}
          />
        )}
        <button onClick={closeEditModal}>Return</button>
      </Modal>
      <Modal isOpen={isFiltersModalOpen} onRequestClose={closeFiltersModal}>
        <BaseMaterialCertificateFilters
          baseMaterialCertificates={baseMaterialCertificates}
          onFilter={(filtered) => {
            setFilteredResources(filtered);
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