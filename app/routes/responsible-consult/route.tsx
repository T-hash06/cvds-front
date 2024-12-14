import { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/UsersManagementLayout';
import styles from './responsible.consult.module.css';
import axios from 'axios';

interface Responsible {
    document: string;
    siteDocument: string;
    name: string;
    phoneNumber: string;
    email: string;
}

const ViewResponsibles = () => {
    const [responsibles, setResponsibles] = useState<Responsible[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalResponsibles, setTotalResponsibles] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedResponsible, setSelectedResponsible] = useState<Responsible | null>(null);
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState('');

    useEffect(() => {
        const fetchTotalCount = async () => {
            try {
                const response = await fetch(
                    'https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/responsibles/count'
                );
                const data = await response.json();
                setTotalResponsibles(data.data);
                setTotalPages(Math.ceil(data.data / pageSize));
            } catch (error) {
                console.error('Error fetching total responsibles count:', error);
            }
        };

        fetchTotalCount();
    }, [pageSize]);

    useEffect(() => {
        const fetchResponsibles = async () => {
            try {
                const response = await fetch(
                    `https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/responsibles?pageNumber=${pageNumber}&pageSize=${pageSize}`
                );
                const data = await response.json();
                setResponsibles(data.data);
            } catch (error) {
                console.error('Error fetching responsibles:', error);
            }
        };

        fetchResponsibles();
    }, [pageNumber, pageSize]);

    const handleNextPage = () => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleUpdate = (responsible: Responsible) => {
        console.log('Updating responsible:', responsible);
        setSelectedResponsible(responsible);
        setUpdatedPhoneNumber(responsible.phoneNumber);
        setUpdatedEmail(responsible.email);
        setIsUpdateModalOpen(true);
    };

    const handleSaveUpdate = async () => {
        if (selectedResponsible) {
            try {
                await axios.patch(
                    `https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/responsibles/${selectedResponsible.document}/contact`,
                    {
                        email: updatedEmail,
                        phoneNumber: updatedPhoneNumber,
                    }
                );
                setIsUpdateModalOpen(false);
                setUpdatedEmail('');
                setUpdatedPhoneNumber('');
                alert('Responsable actualizado con éxito');
            } catch (error) {
                console.error('Error updating responsible:', error);
                alert('Error al actualizar responsable');
            }
        }
    };

    const handleDelete = (document: string) => {
        setDocumentToDelete(document);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(
                `https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/delete/${documentToDelete}`
            );
            setIsDeleteModalOpen(false);
            setDocumentToDelete('');
            alert('Responsable eliminado con éxito');
        } catch (error) {
            console.error('Error deleting responsible:', error);
            alert('Error al eliminar responsable');
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDocumentToDelete('');
    };

    return (
        <div className={styles.viewPage}>
            <MainLayout>
                <h1>Consulta de Responsables</h1>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Documento</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Actualizar</th>
                        <th>Eliminar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {responsibles.map((responsible, index) => (
                        <tr key={index}>
                            <td>{responsible.name}</td>
                            <td>{responsible.document}</td>
                            <td>{responsible.phoneNumber}</td>
                            <td>{responsible.email}</td>
                            <td>
                                <button
                                    className={styles.updateButton}
                                    onClick={() => handleUpdate(responsible)}
                                >
                                    Actualizar
                                </button>
                            </td>
                            <td>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(responsible.document)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <button onClick={handlePrevPage} disabled={pageNumber === 1}>
                        Anterior
                    </button>
                    <span>
                        Página {pageNumber} de {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={pageNumber === totalPages}>
                        Siguiente
                    </button>
                </div>
            </MainLayout>
            {isUpdateModalOpen && selectedResponsible && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Actualizar Responsable</h2>
                        <input
                            type="email"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            value={updatedPhoneNumber}
                            onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
                            placeholder="Teléfono"
                        />
                        <button onClick={handleSaveUpdate}>Guardar</button>
                        <button onClick={() => setIsUpdateModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>¿Estás seguro de que deseas eliminar este responsable?</h2>
                        <button onClick={handleConfirmDelete}>Sí, eliminar</button>
                        <button onClick={handleCancelDelete}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewResponsibles;
