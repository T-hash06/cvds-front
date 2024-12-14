import { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/UsersManagementLayout';
import styles from './student-consult.module.css';
import axios from 'axios';

interface Student {
    id: string;
    name: string;
    document: string;
    documentType: string;
    courseName: string;
    responsibleDocument: string;
    status: string; // Activo o Desactivado
}

const ViewStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [updatedCourseName, setUpdatedCourseName] = useState('');

    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [idToDeactivate, setIdToDeactivate] = useState<string | null>(null);

    useEffect(() => {
        const fetchTotalCount = async () => {
            try {
                const response = await axios.get(
                    'https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/students/count'
                );
                setTotalStudents(response.data.data);
                setTotalPages(Math.ceil(response.data.data / pageSize));
            } catch (error) {
                console.error('Error fetching total students count:', error);
            }
        };

        fetchTotalCount();
    }, [pageSize]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(
                    `https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/students?pageNumber=${pageNumber}&pageSize=${pageSize}`
                );
                setStudents(response.data.data);
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

    // Handle course update
    const handleUpdate = (student: Student) => {
        setSelectedStudent(student);
        setUpdatedCourseName(student.courseName);
        setIsUpdateModalOpen(true);
    };

    const handleSaveUpdate = async () => {
        if (selectedStudent) {
            try {
                await axios.patch(
                    `https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/students/${selectedStudent.id}/course`,
                    { courseName: updatedCourseName }
                );
                alert('Curso del estudiante actualizado con éxito');
                setIsUpdateModalOpen(false);
                setUpdatedCourseName('');
            } catch (error) {
                console.error('Error updating course:', error);
                alert('Error al actualizar el curso del estudiante');
            }
        }
    };

    // Handle deactivate student
    const handleDeactivate = () => {
        setIsDeactivateModalOpen(true);
    };

    const handleConfirmDeactivate = async () => {
        if (idToDeactivate) {
            try {
                await axios.patch(
                    `https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/users/students/${idToDeactivate}/deactivate`
                );
                alert('Estudiante desactivado con éxito');
                setIsDeactivateModalOpen(false);
                setIdToDeactivate(null);
            } catch (error) {
                console.error('Error deactivating student:', error);
                alert('Error al desactivar al estudiante');
            }
        }
    };

    const handleCancelDeactivate = () => {
        setIsDeactivateModalOpen(false);
        setIdToDeactivate(null);
    };

    return (
        <div className={styles.viewPage}>
            <MainLayout>
                <h1>Consulta de Estudiantes</h1>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Documento</th>
                        <th>Tipo de Documento</th>
                        <th>Curso</th>
                        <th>Documento Responsable</th>
                        <th>Estado</th>
                        <th>Actualizar</th>
                        <th>Desactivar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.document}</td>
                            <td>{student.documentType}</td>
                            <td>{student.courseName}</td>
                            <td>{student.responsibleDocument}</td>
                            <td>{student.status}</td>
                            <td>
                                <button
                                    className={styles.updateButton}
                                    onClick={() => handleUpdate(student)}
                                >
                                    Actualizar Curso
                                </button>
                            </td>
                            <td>
                                <button
                                    className={styles.deactivateButton}
                                    onClick={() => {
                                        setIdToDeactivate(student.id);
                                        handleDeactivate();
                                    }}
                                >
                                    Desactivar
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

            {isUpdateModalOpen && selectedStudent && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Actualizar Curso del Estudiante</h2>
                        <input
                            type="text"
                            value={updatedCourseName}
                            onChange={(e) => setUpdatedCourseName(e.target.value)}
                            placeholder="Nuevo curso"
                        />
                        <button onClick={handleSaveUpdate}>Guardar</button>
                        <button onClick={() => setIsUpdateModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {isDeactivateModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>¿Estás seguro de que deseas desactivar a este estudiante?</h2>
                        <button onClick={handleConfirmDeactivate}>Sí, desactivar</button>
                        <button onClick={handleCancelDeactivate}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewStudents;
