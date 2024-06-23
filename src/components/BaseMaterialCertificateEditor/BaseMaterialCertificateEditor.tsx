import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/app-state';
import axios from 'axios';
import { ActionType } from '../../redux/action-type';
import { useNavigate } from 'react-router-dom';
import { IBaseMaterialCertificate } from '../../models/IBaseMaterialCertificate';
import { IBaseMaterialType } from '../../models/IBaseMaterialType';

function BaseMaterialCertificateEditor() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const baseMaterialCertificate: IBaseMaterialCertificate = useSelector((state: AppState) => state.editedBaseMaterialCertificate);

    const [isChangesMade, setIsChangesMade] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [formData, setFormData] = useState<IBaseMaterialCertificate>({
        id: baseMaterialCertificate.id,
        heatNum: baseMaterialCertificate.heatNum,
        lotNum: baseMaterialCertificate.lotNum,
        materialTypeName: baseMaterialCertificate.materialTypeName
    });
    const [baseMaterialTypes, setBaseMaterialTypes] = useState<IBaseMaterialType[]>([]);

    const isNewBaseMaterialCertificate: boolean = formData.id == -1;

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            await getAllMaterialTypes();
        } catch (error) {
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

    async function getAllMaterialTypes() {
        try {
            const responseBaseMaterialTypes = await axios.get(`http://localhost:8080/base-material-types`);
            const baseMaterialTypes = responseBaseMaterialTypes.data;
            setBaseMaterialTypes(baseMaterialTypes);
        } catch (error: any) {
            console.error("Error fetching base material types:", error);
        }
    }

    function inputChanged(event: any) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setIsChangesMade(true);
    };

    async function onSaveChangesClicked() {
        try {
            if (isNewBaseMaterialCertificate) {
                await axios.post(`http://localhost:8080/base-material-certificates`, formData);
            } else {
                await axios.put(`http://localhost:8080/base-material-certificates`, formData);
            }

            updateBaseMaterialCertificatesState();

            if (isNewBaseMaterialCertificate) {
                alert("Base material certificate created successfully");
            } else {
                alert("Base material certificate updated successfully");
            }
            navigate(`/base_material_certificates`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    };

    async function onDeleteClicked() {
        try {
            await axios.delete(`http://localhost:8080/base-material-certificates/${formData.id}`);
            updateBaseMaterialCertificatesState();
            alert("Base material certificate deleted successfully");
            navigate(`/base_material_certificates`);
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        };
    };

    async function updateBaseMaterialCertificatesState() {
        const responseBaseMaterialCertificates = await axios.get(`http://localhost:8080/base-material-certificates`);
        const baseMaterialCertificates: IBaseMaterialCertificate[] = responseBaseMaterialCertificates.data;
        dispatch({
            type: ActionType.UpdateBaseMaterialCertificates,
            payload: { baseMaterialCertificates: baseMaterialCertificates }
        });
    };

    return (
        <div className='BaseMaterialCertificateEditor'>
            {!isNewBaseMaterialCertificate && (
                <div>
                    <label>Certificate #: {formData.id}</label>
                </div>
            )}
            <div>
                <label>Heat #:</label>
                <input
                    type='text'
                    name='heatNum'
                    value={formData.heatNum}
                    onChange={inputChanged}
                />
            </div>
            <div>
                <label>Lot #:</label>
                <input
                    type='text'
                    name='lotNum'
                    value={formData.lotNum}
                    onChange={inputChanged}
                />
            </div>
            <div>
                <label>Material Type:</label>
                <select
                    name='materialTypeName'
                    value={formData.materialTypeName}
                    onChange={inputChanged}
                >
                    <option value="">Select Material Type</option>
                    {baseMaterialTypes.map((type) => (
                        <option key={type.id} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <button
                    style={{
                        cursor: isChangesMade ? 'pointer' : 'not-allowed' //Temp solution until CSS
                    }}
                    onClick={onSaveChangesClicked}
                    disabled={!isChangesMade}>
                    Save Changes
                </button>
                {!isNewBaseMaterialCertificate && (
                    <button onClick={onDeleteClicked}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default BaseMaterialCertificateEditor;