import { Button } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import MainLayout from '../../components/layouts/MainLayout';
import consultarEstudiantes from './assets/consultar_estudiantes.svg';
import consultarResponsables from './assets/consultar_responsables.svg';
import registrarCurso from './assets/registrar_curso.svg';
import registrarEstudiante from './assets/registrar_estudiante.svg';
import registrarResponsable from './assets/registrar_responsable.svg';
import styles from './users-management.module.css';

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
			<img src={image} alt={title} className={styles.studentIcon} />
			<Button
				color='secondary'
				radius='full'
				variant='light'
				onClick={onClick}
			>
				<h2 className={styles.studentCardTitle}>{title}</h2>
			</Button>
		</div>
	);
};

const RegisterStudent = () => {
	return (
		<Link to='/students-add' style={{ textDecoration: 'none' }}>
			<StudentCard
				image={registrarEstudiante}
				title='Registrar Estudiante'
				onClick={() => {}}
			/>
		</Link>
	);
};

const RegisterGuardian = () => {
	return (
		<Link to='/responsible-add' style={{ textDecoration: 'none' }}>
			<StudentCard
				image={registrarResponsable}
				title='Registrar Responsable'
				onClick={() => {}}
			/>
		</Link>
	);
};

const RegisterCourse = () => {
	return (
		<Link to='/course-add' style={{ textDecoration: 'none' }}>
			<StudentCard
				image={registrarCurso}
				title='Registrar Curso'
				onClick={() => {}}
			/>
		</Link>
	);
};

const ViewStudents = () => {
	return (
		<Link to='/student-consult' style={{ textDecoration: 'none' }}>
			<StudentCard
				image={consultarEstudiantes}
				title='Consulta de Estudiantes'
				onClick={() => {}}
			/>
		</Link>
	);
};

const ViewGuardians = () => {
	return (
		<Link to='/responsible-consult' style={{ textDecoration: 'none' }}>
			<StudentCard
				image={consultarResponsables}
				title='Consulta de Responsables'
				onClick={() => {}}
			/>
		</Link>
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
