import { useMemo } from "react";
import { IBaseMaterialCertificate } from "../../models/IBaseMaterialCertificate";

interface BaseMaterialCertificateFiltersProps {
  baseMaterialCertificates: IBaseMaterialCertificate[];
  onFilter: (filteredCertificates: IBaseMaterialCertificate[]) => void;
  selectedNames: string[];
  setSelectedNames: React.Dispatch<React.SetStateAction<string[]>>;
  selectedHeatNums: string[];
  setSelectedHeatNums: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLotNums: string[];
  setSelectedLotNums: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBaseMaterialTypes: string[];
  setSelectedBaseMaterialTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

function BaseMaterialCertificateFilters({
  baseMaterialCertificates,
  onFilter,
  selectedNames,
  setSelectedNames,
  selectedHeatNums,
  setSelectedHeatNums,
  selectedLotNums,
  setSelectedLotNums,
  selectedBaseMaterialTypes,
  setSelectedBaseMaterialTypes,
}: BaseMaterialCertificateFiltersProps) {
  const uniqueHeatNums = useMemo(() => {
    return Array.from(new Set(baseMaterialCertificates.map(c => c.heatNum)));
  }, [baseMaterialCertificates]);

  const uniqueLotNums = useMemo(() => {
    return Array.from(new Set(baseMaterialCertificates.map(c => c.lotNum)));
  }, [baseMaterialCertificates]);

  const uniqueBaseMaterialTypes = useMemo(() => {
    return Array.from(new Set(baseMaterialCertificates.map(c => c.baseMaterialType.name)));
  }, [baseMaterialCertificates]);

  const uniqueNames = useMemo(() => {
    return Array.from(new Set(baseMaterialCertificates.map(c => c.name)));
  }, [baseMaterialCertificates]);

  function handleSelectionChange(setter: React.Dispatch<React.SetStateAction<string[]>>, value: string[]) {
    setter(value);
  }

  function applyFilters() {
    const filteredCertificates = baseMaterialCertificates.filter(
      (certificate) =>
        (selectedNames.length === 0 || selectedNames.includes(certificate.name)) &&
        (selectedHeatNums.length === 0 || selectedHeatNums.includes(certificate.heatNum)) &&
        (selectedLotNums.length === 0 || selectedLotNums.includes(certificate.lotNum)) &&
        (selectedBaseMaterialTypes.length === 0 || selectedBaseMaterialTypes.includes(certificate.baseMaterialType.name))
    );
    onFilter(filteredCertificates);
  }

  function clearFilters() {
    setSelectedNames([]);
    setSelectedHeatNums([]);
    setSelectedLotNums([]);
    setSelectedBaseMaterialTypes([]);
    onFilter(baseMaterialCertificates);
  }

  return (
    <div className="BaseMaterialCertificateFilters">
      <div>
        <label>Name:</label>
        <select
          multiple
          value={selectedNames}
          onChange={(e) => handleSelectionChange(setSelectedNames, Array.from(e.target.selectedOptions, option => option.value))}
        >
          {uniqueNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Heat #:</label>
        <select
          multiple
          value={selectedHeatNums}
          onChange={(e) => handleSelectionChange(setSelectedHeatNums, Array.from(e.target.selectedOptions, option => option.value))}
        >
          {uniqueHeatNums.map((heatNum, index) => (
            <option key={index} value={heatNum}>
              {heatNum}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Lot #:</label>
        <select
          multiple
          value={selectedLotNums}
          onChange={(e) => handleSelectionChange(setSelectedLotNums, Array.from(e.target.selectedOptions, option => option.value))}
        >
          {uniqueLotNums.map((lotNum, index) => (
            <option key={index} value={lotNum}>
              {lotNum}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Material Type:</label>
        <select
          multiple
          value={selectedBaseMaterialTypes}
          onChange={(e) => handleSelectionChange(setSelectedBaseMaterialTypes, Array.from(e.target.selectedOptions, option => option.value))}
        >
          {uniqueBaseMaterialTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={clearFilters}>Clear Filters</button>
      </div>
    </div>
  );
}

export default BaseMaterialCertificateFilters;
