import {
	Button,
	Input,
	Divider,
	Autocomplete,
	AutocompleteItem
} from '@nextui-org/react';
import { useState } from 'react';
import UsersManagementLayout from '../../components/layouts/UsersManagementLayout';
import styles from './students.add.module.css';

const Title = () => {
	return <h1 className={styles.title}>Adicionar Estudiante</h1>;
};

const SubtitleStudent = () => {
	return <h2 className={styles.subtitle}>Información del Estudiante</h2>
};

const SubtitleResponsible = () => {
	return <h2 className={styles.subtitle}>Información del Responsable</h2>
};

const typesDocument = [
	{label: "NUIP", key: "NUIP"},
	{label: "Registro Civil", key: "REGISTRO CIVIL"},
	{label: "TI", key: "TI"},
];

const grades = [
	{label: "1", key: "1"},
	{label: "2", key: "2"},
	{label: "3", key: "3"},
	{label: "4", key: "4"},
	{label: "5", key: "5"},
	{label: "6", key: "6"},
] // OBTENER DE BACK

const courses = [
	{label: "101", key: "101"},
	{label: "201", key: "201"},
	{label: "301", key: "301"},
	{label: "401", key: "401"},
	{label: "501", key: "501"},
	{label: "601", key: "601"},
] // OBTENER DE BACK

const AddStudent = () => {
	const [formData, setFormData] = useState({
		studentName: '',
		typeDoc: '',
		studentDoc: '',
		grade: '',
		course: '',
		id: '',
		responsibleDoc: ''
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = () => {
		if (formData.studentName.trim() === '') {
			alert('Ingresa un nombre de estudiante.');
			return;
		}
		if (formData.typeDoc.trim() === '') {
			alert('Ingresa el tipo de documento del estudiante.');
			return;
		}
		if (formData.studentDoc.trim() === '') {
			alert('Ingresa el documento del estudiante.');
			return;
		}
		if (formData.grade.trim() === '') {
			alert('Ingresa el grado actual del responsable.');
			return;
		}
		if (formData.course.trim() === '') {
			alert('Ingresa el curso actual del estudiante.');
			return;
		}
		if (formData.id.trim() === '') {
			alert('Ingresa el id del estudiante.');
			return;
		}
		if (formData.responsibleDoc.trim() === '') {
			alert('Ingresa el documento del responsable.');
			return;
		}

		// Envío a API

		console.log('Datos del formulario:', formData);
		// Llamada a API
		setFormData({
			studentName: '',
			typeDoc: '',
			studentDoc: '',
			grade: '',
			course: '',
			id: '',
			responsibleDoc: ''
		});
	};

	return (
		<div className={styles.mainContainer}>
			<UsersManagementLayout>
				<div className={styles.studentsPage}>
					<Title/>
					<Divider className="my-6"/>
					<div className={styles.flexContainer}>
						<div className={styles.column}>
							<SubtitleStudent/>
							<br/>
							<Input
								isRequired
								key={"outside"}
								label="Nombres y Apellidos Completos"
								labelPlacement={"outside"}
								name={"studentName"}
								value={formData.studentName}
								onChange={handleChange}
							/> <br/>
							<Autocomplete
								isRequired
								key={"outside"}
								className="max-w-xs"
								defaultItems={typesDocument}
								label="Tipo de Documento"
								labelPlacement={"outside"}
								name="typeDoc"
								value={formData.typeDoc}
								onChange={handleChange}
							>
								{(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
							</Autocomplete> <br/><br/>
							<Input
								isRequired
								key={"outside"}
								label="Número de Documento"
								labelPlacement={"outside"}
								name="studentDoc"
								value={formData.studentDoc}
								onChange={handleChange}
							/> <br/>
							<Autocomplete
								isRequired
								key={"outside"}
								className="max-w-xs"
								defaultItems={grades}
								label="Grado"
								labelPlacement={"outside"}
								name="grade"
								value={formData.grade}
								onChange={handleChange}
							>
								{(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
							</Autocomplete> <br/><br/>
						</div>
						<div className={styles.verticalDivider}></div>
						<div className={styles.column}>
							<br/><br/>
							<Autocomplete
								isRequired
								key={"outside"}
								className="max-w-xs"
								defaultItems={courses}
								label="Curso"
								labelPlacement={"outside"}
								name="course"
								value={formData.course}
								onChange={handleChange}
							>
								{(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
							</Autocomplete> <br/><br/>
							<Input
								isRequired
								key={"outside"}
								label="Codigo"
								labelPlacement={"outside"}
								name={"id"}
								value={formData.id}
								onChange={handleChange}
							/><br/>
							<SubtitleResponsible/>
							<br/>
							<Input
								isRequired
								description="El responsable ya se debe encontrar registrado en el sistema."
								label="Número de Documento"
								labelPlacement="outside"
								name="responsibleDoc"
								value={formData.responsibleDoc}
								onChange={handleChange}
							/>
						</div>
					</div>
					<br/>
					<Divider className="my-6"/>
					<Button onClick={handleSubmit} className={styles.buttonCustom}>
						Adicionar Estudiante
					</Button>
				</div>
			</UsersManagementLayout>
		</div>
	);
};

export default AddStudent;