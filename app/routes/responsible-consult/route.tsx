import { useEffect, useState } from 'react';
import MainLayout from '../../components/layouts/UsersManagementLayout';
import styles from './responsible.consult.module.css';

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


    const handleUpdate = (document: string) => {
        console.log('Actualizar responsable con documento:', document);
        // Lógica para actualizar el responsable
    };

    const handleDelete = (document: string) => {
        console.log('Eliminar responsable con documento:', document);
        // Lógica para eliminar el responsable
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
                                    onClick={() => handleUpdate(responsible.document)}
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
        </div>
    );
};

export default ViewResponsibles;
