import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ActionType } from '../../redux/action-type';
import axios from 'axios';
import { IBaseMaterialCertificate } from '../../models/IBaseMaterialCertificate';

function BaseMaterialCertificatesList() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [baseMaterialCertificates, setBaseMaterialCertificates] = useState<IBaseMaterialCertificate[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            await getBaseMaterialCertificates();
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

    async function getBaseMaterialCertificates() {
        try {
            const responseBaseMaterialCertificates = await axios.get(`http://localhost:8080/base-material-certificates`);
            const baseMaterialCertificates = responseBaseMaterialCertificates.data;
            setBaseMaterialCertificates(baseMaterialCertificates);
        } catch (error: any) {
            console.error("Error fetching base material certificates:", error);
        }
    }

    function onEditClicked(id: number) {
        const editedBaseMaterialCertificate = baseMaterialCertificates.find(baseMaterialCertificate => baseMaterialCertificate.id === id);
        if (editedBaseMaterialCertificate) {
            dispatch({
                type: ActionType.EditBaseMaterialCertificate,
                payload: { editedBaseMaterialCertificate: editedBaseMaterialCertificate }
            });
            navigate(`/base_material_certificate_editor?Id=${id}`);
        }
    };

    return (
        <div className="BaseMaterialCertificatesList">
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
                    {baseMaterialCertificates.length > 0 ? (
                        baseMaterialCertificates.map((baseMaterialCertificate) => (
                            <tr key={baseMaterialCertificate.id}>
                                <td>{baseMaterialCertificate.id}</td>
                                <td>{baseMaterialCertificate.heatNum}</td>
                                <td>{baseMaterialCertificate.lotNum}</td>
                                <td>{baseMaterialCertificate.materialTypeName}</td>
                                <td><button
                                    onClick={() => onEditClicked(baseMaterialCertificate.id)}
                                >
                                    Edit
                                </button></td>
                            </tr>
                        ))
                    ) : (
                        <p>No base material certificates available</p>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default BaseMaterialCertificatesList;
