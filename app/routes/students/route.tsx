import { Button } from '@nextui-org/react';
import { useState } from 'react';
import styles from './students.module.css';

// Importar las imágenes (asumiendo que se agregarán después)
import registrarEstudiante from './assets/registrar_estudiante.svg';
import registrarResponsable from './assets/registrar_responsable.svg';
import registrarCurso from './assets/registrar_curso.svg';
import consultarEstudiantes from './assets/consultar_estudiantes.svg';
import consultarResponsables from './assets/consultar_responsables.svg';

/**
 * Title component that renders the main heading
 */
const Title = () => {
	return <h1 className={styles.title}>¿Qué quieres realizar?</h1>;
};

/**
 * RegisterStudent component for student registration functionality
 */
const RegisterStudent = () => {
	return (
		<div className={styles.studentCard}>
			<img
				src={registrarEstudiante}
				alt='Registrar Estudiante'
				className={styles.studentIcon}
			/>
			<Button color='secondary' radius='full' variant='light'>
				<h2 className={styles.studentCardTitle}>
					Registrar Estudiante
				</h2>
			</Button>
		</div>
	);
};

/**
 * RegisterGuardian component for guardian registration functionality
 */
const RegisterGuardian = () => {
	return (
		<div className={styles.studentCard}>
			<img
				src={registrarResponsable}
				alt='Registrar Responsable'
				className={styles.studentIcon}
			/>
			<Button color='secondary' radius='full' variant='light'>
				<h2 className={styles.studentCardTitle}>
					Registrar Responsable
				</h2>
			</Button>
		</div>
	);
};

/**
 * RegisterCourse component for course registration functionality
 */
const RegisterCourse = () => {
	return (
		<div className={styles.studentCard}>
			<img
				src={registrarCurso}
				alt='Registrar Curso'
				className={styles.studentIcon}
			/>
			<Button color='secondary' radius='full' variant='light'>
				<h2 className={styles.studentCardTitle}>Registrar Curso</h2>
			</Button>
		</div>
	);
};

/**
 * ViewStudents component for student consultation functionality
 */
const ViewStudents = () => {
	return (
		<div className={styles.studentCard}>
			<img
				src={consultarEstudiantes}
				alt='Consulta de Estudiantes'
				className={styles.studentIcon}
			/>
			<Button color='secondary' radius='full' variant='light'>
				<h2 className={styles.studentCardTitle}>
					Consulta de Estudiantes
				</h2>
			</Button>
		</div>
	);
};

/**
 * ViewGuardians component for guardian consultation functionality
 */
const ViewGuardians = () => {
	return (
		<div className={styles.studentCard}>
			<img
				src={consultarResponsables}
				alt='Consulta de Responsables'
				className={styles.studentIcon}
			/>
			<Button color='secondary' radius='full' variant='light'>
				<h2 className={styles.studentCardTitle}>
					Consulta de Responsables
				</h2>
			</Button>
		</div>
	);
};

/**
 * Modules component that combines all the functionality cards
 */
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

/**
 * Main Students component that renders the entire page
 */
const Students = () => {
	return (
		<main className={styles.studentsPage}>
			<Title />
			<Modules />
		</main>
	);
};

export default Students;
