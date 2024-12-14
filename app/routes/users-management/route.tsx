import {
	Button,
} from '@nextui-org/react';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './users-management.module.css';

import registrarEstudiante from './assets/registrar_estudiante.svg';
import registrarResponsable from './assets/registrar_responsable.svg';
import registrarCurso from './assets/registrar_curso.svg';
import consultarEstudiantes from './assets/consultar_estudiantes.svg';
import consultarResponsables from './assets/consultar_responsables.svg';

// Definir la interfaz para las props de StudentCard
interface StudentCardProps {
	image: string;
	title: string;
	onClick: () => void;
}

const Title = () => {
	return <h1 className={styles.title}>¿Qué quieres realizar?</h1>;
};

const StudentCard: React.FC<StudentCardProps> = ({ image, title, onClick }) => {
	return (
		<div className={styles.studentCard}>
			<img
				src={image}
				alt={title}
				className={styles.studentIcon}
			/>
			<Button
				color="secondary"
				radius="full"
				variant="light"
				onClick={onClick}
			>
				<h2 className={styles.studentCardTitle}>
					{title}
				</h2>
			</Button>
		</div>
	);
};

const RegisterStudent = () => {
	return (
		<StudentCard
			image={registrarEstudiante}
			title="Registrar Estudiante"
			onClick={() => {}}
		/>
	);
};

const RegisterGuardian = () => {
	return (
		<StudentCard
			image={registrarResponsable}
			title="Registrar Responsable"
			onClick={() => {}}
		/>
	);
};

const RegisterCourse = () => {
	return (
		<StudentCard
			image={registrarCurso}
			title="Registrar Curso"
			onClick={() => {}}
		/>
	);
};

const ViewStudents = () => {
	return (
		<StudentCard
			image={consultarEstudiantes}
			title="Consulta de Estudiantes"
			onClick={() => {}}
		/>
	);
};

const ViewGuardians = () => {
	return (
		<StudentCard
			image={consultarResponsables}
			title="Consulta de Responsables"
			onClick={() => {}}
		/>
	);
};

const Modules = () => {
	return (
		<div className={styles.studentsModules}>
			<RegisterStudent />
			<RegisterGuardian />
			<RegisterCourse />
			<ViewStudents />
			<ViewGuardians />
		</div>
	);
};

const Students = () => {
	return (
		<div className={styles.mainContainer}>
			<MainLayout>
				<div className={styles.studentsPage}>
					<Title />
					<Modules />
				</div>
			</MainLayout>
		</div>
	);
};

export default Students;