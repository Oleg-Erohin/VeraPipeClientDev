import { useState, useEffect } from "react";
import { IBaseMaterialCertificate } from "../../models/IBaseMaterialCertificate";
import { IBaseMaterialType } from "../../models/IBaseMaterialType";
import { IBaseMaterialCertificateFilter } from "../../filter_models/IBaseMaterialCertificate";

interface BaseMaterialCertificateFiltersProps {
  baseMaterialCertificates: IBaseMaterialCertificate[];
  applyFilters: (filters: IBaseMaterialCertificateFilter) => void;
}

function BaseMaterialCertificateFilters({ baseMaterialCertificates, applyFilters, }: BaseMaterialCertificateFiltersProps) {
  const [names, setNames] = useState<string[]>([]);
  const [heatNums, setHeatNums] = useState<string[]>([]);
  const [lotNums, setLotNums] = useState<string[]>([]);
  const [materialTypes, setMaterialTypes] = useState<IBaseMaterialType[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedHeatNums, setSelectedHeatNums] = useState<string[]>([]);
  const [selectedLotNums, setSelectedLotNums] = useState<string[]>([]);
  const [selectedMaterialTypes, setSelectedMaterialTypes] = useState<string[]>([]);

  useEffect(() => {
    const uniqueNames = Array.from(
      new Set(baseMaterialCertificates.map((cert) => cert.name))
    );
    const uniqueHeatNums = Array.from(
      new Set(baseMaterialCertificates.map((cert) => cert.heatNum))
    );
    const uniqueLotNums = Array.from(
      new Set(baseMaterialCertificates.map((cert) => cert.lotNum))
    );
    const uniqueMaterialTypes = Array.from(
      new Set(
        baseMaterialCertificates.map((cert) => cert.baseMaterialType.name)
      )
    );

    setNames(uniqueNames);
    setHeatNums(uniqueHeatNums);
    setLotNums(uniqueLotNums);
    setMaterialTypes(
      uniqueMaterialTypes.map(
        (name) =>
          baseMaterialCertificates.find(
            (cert) => cert.baseMaterialType.name === name
          )?.baseMaterialType!
      )
    );
  }, [baseMaterialCertificates]);

  const handleApplyFilters = () => {
    const filters: IBaseMaterialCertificateFilter = {
      names: selectedNames,
      heatNums: selectedHeatNums,
      lotNums: selectedLotNums,
      baseMaterialTypes: materialTypes.filter((type) => selectedMaterialTypes.includes(type.name)),
    };
    applyFilters(filters);
  };

  return (
    <div className="BaseMaterialCertificateFilters">
      <div>
        <label>Name:</label>
        <select
          multiple
          value={selectedNames}
          onChange={(e) =>
            setSelectedNames(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {names.map((name) => (
            <option key={name} value={name}>
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
          onChange={(e) =>
            setSelectedHeatNums(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {heatNums.map((heatNum) => (
            <option key={heatNum} value={heatNum}>
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
          onChange={(e) =>
            setSelectedLotNums(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {lotNums.map((lotNum) => (
            <option key={lotNum} value={lotNum}>
              {lotNum}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Material Type:</label>
        <select
          multiple
          value={selectedMaterialTypes}
          onChange={(e) =>
            setSelectedMaterialTypes(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {materialTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleApplyFilters}>Apply Filters</button>
    </div>
  );
}

export default BaseMaterialCertificateFilters;