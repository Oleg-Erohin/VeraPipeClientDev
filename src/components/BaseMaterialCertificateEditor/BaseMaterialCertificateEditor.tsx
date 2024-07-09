import { useEffect, useState } from 'react';
import axios from 'axios';
import { IBaseMaterialCertificate } from '../../models/IBaseMaterialCertificate';
import { IBaseMaterialType } from '../../models/IBaseMaterialType';
import Modal from 'react-modal';

interface BaseMaterialCertificateEditorProps {
    props: IBaseMaterialCertificate;
}

function BaseMaterialCertificateEditor({ props }: BaseMaterialCertificateEditorProps) {

    Modal.setAppElement('#root');

    const [isChangesMade, setIsChangesMade] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [formData, setFormData] = useState<IBaseMaterialCertificate>({
        id: props.id,
        heatNum: props.heatNum,
        lotNum: props.lotNum,
        materialTypeName: props.materialTypeName
    });
    const [baseMaterialTypes, setBaseMaterialTypes] = useState<IBaseMaterialType[]>([]);
    const isNewBaseMaterialCertificate: boolean = formData.id == -1;
    const selectedMaterialType = baseMaterialTypes.find(type => type.name == props.materialTypeName);

    useEffect(() => {
        fetchData();
    }, []);

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

    function openDeleteModal() {
        setDeleteModalIsOpen(true);
    };

    function closeDeleteModal() {
        setDeleteModalIsOpen(false);
    };

    async function getAllMaterialTypes() {
        try {
            const responseBaseMaterialTypes = await axios.get(`http://localhost:8080/base-material-types`);
            const baseMaterialTypes = responseBaseMaterialTypes.data;
            setBaseMaterialTypes(baseMaterialTypes);
        } catch (error: any) {
            console.error("Error fetching base material types:", error);
            setIsError(true);
        }
    }

    function inputChanged(event: any) {
        const { name, value } = event.target;

        if (name == 'materialTypeName') {
            const selectedType = baseMaterialTypes.find(type => type.id == parseInt(value));
            if (selectedType) {
                setFormData({
                    ...formData,
                    materialTypeName: selectedType.name,
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        setIsChangesMade(true);
    };

    async function onSaveChangesClicked() {
        try {
            if (isNewBaseMaterialCertificate) {
                await axios.post(`http://localhost:8080/base-material-certificates`, formData);
            } else {
                await axios.put(`http://localhost:8080/base-material-certificates`, formData);
            }

            if (isNewBaseMaterialCertificate) {
                alert("Base material certificate created successfully");
            } else {
                alert("Base material certificate updated successfully");
            }
            window.location.reload();
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        }
    };

    async function onDeleteClicked() {
        openDeleteModal();
    };

    async function onConfirmClicked() {
        try {
            await axios.delete(`http://localhost:8080/base-material-certificates/${formData.id}`);
            alert("Base material certificate deleted successfully");
            window.location.reload();
        } catch (error: any) {
            alert(error.response.data.errorMessage);
        };
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
                    value={selectedMaterialType ? selectedMaterialType.id : ''}
                    onChange={inputChanged}
                >
                    <option value="">Select Material Type</option>
                    {baseMaterialTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>            </div>
            <div>
                <button
                    style={{
                        cursor: isChangesMade ? 'pointer' : 'not-allowed' //Temp solution until CSS
                    }}
                    onClick={onSaveChangesClicked}
                    disabled={!isChangesMade}>
                    Save
                </button>
                {!isNewBaseMaterialCertificate && (
                    <button onClick={onDeleteClicked}>
                        Delete
                    </button>
                )}
            </div>
            <Modal isOpen={deleteModalIsOpen} onRequestClose={closeDeleteModal}>
                <label>Are you sure you want to delete this base material certificate?</label>
                <button onClick={onConfirmClicked}>
                    Confirm
                </button>
                <button onClick={closeDeleteModal}>
                    Return
                </button>
            </Modal>
        </div>
    );
}

export default BaseMaterialCertificateEditor;