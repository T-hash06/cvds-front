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
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchResponsibles = async () => {
            try {
                const response = await fetch(
                    `https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/responsibles?pageNumber=${pageNumber}&pageSize=${pageSize}`
                );
                const data = await response.json();
                setResponsibles(data);
            } catch (error) {
                console.error('Error fetching responsibles:', error);
            }
        };

        fetchResponsibles();
    }, [pageNumber, pageSize]);

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
                    </tr>
                    </thead>
                    <tbody>
                    {responsibles.map((responsible, index) => (
                        <tr key={index}>
                            <td>{responsible.name}</td>
                            <td>{responsible.document}</td>
                            <td>{responsible.phoneNumber}</td>
                            <td>{responsible.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </MainLayout>
        </div>
    );
};


export default ViewResponsibles;
