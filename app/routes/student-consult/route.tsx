import { useEffect, useState } from 'react';
import MainLayout from '../../components/layouts/UsersManagementLayout';
import styles from './student-consult.module.css';

interface Student {
    id: string;
    name: string;
    document: string;
    documentType: string;
    courseName: string;
    responsibleDocument: string;
}

const ViewStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchTotalCount = async () => {
            try {
                const response = await fetch(
                    'https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/students/count'
                );
                const data = await response.json();
                setTotalStudents(data.data);
                setTotalPages(Math.ceil(data.data / pageSize));
            } catch (error) {
                console.error('Error fetching total students count:', error);
            }
        };

        fetchTotalCount();
    }, [pageSize]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(
                    `https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/students?pageNumber=${pageNumber}&pageSize=${pageSize}`
                );
                const data = await response.json();
                setStudents(data.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
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

    return (
        <div className={styles.viewPage}>
            <MainLayout>
                <h1>Consulta de Estudiantes</h1>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo Documento</th>
                        <th>Documento</th>
                        <th>Curso</th>
                        <th>Documento Responsable</th>
                        <th>Actualizar</th>
                        <th>Desactivar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td>{student.name}</td>
                            <td>{student.documentType}</td>
                            <td>{student.document}</td>
                            <td>{student.courseName}</td>
                            <td>{student.responsibleDocument}</td>
                            <td>
                                <button className={styles.updateButton}>Actualizar</button>
                            </td>
                            <td>
                                <button className={styles.deactivateButton}>Desactivar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <button onClick={handlePrevPage} disabled={pageNumber === 1}>
                        Anterior
                    </button>
                    <span>Página {pageNumber} de {totalPages}</span>
                    <button onClick={handleNextPage} disabled={pageNumber === totalPages}>
                        Siguiente
                    </button>
                </div>
            </MainLayout>
        </div>
    );
};

export default ViewStudents;
