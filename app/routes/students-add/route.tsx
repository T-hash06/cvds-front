import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Divider,
	Input,
} from '@nextui-org/react';
import axios from 'axios';
import { useState } from 'react';
import UsersManagementLayout from '../../components/layouts/UsersManagementLayout';
import styles from './students.add.module.css';

const Title = () => {
	return <h1 className={styles.title}>Adicionar Estudiante</h1>;
};

const SubtitleStudent = () => {
	return <h2 className={styles.subtitle}>Información del Estudiante</h2>;
};

const SubtitleResponsible = () => {
	return <h2 className={styles.subtitle}>Información del Responsable</h2>;
};

const typesDocument = [
	{ label: 'NUIP', key: 'NUIP' },
	{ label: 'Registro Civil', key: 'REGISTRO CIVIL' },
	{ label: 'TI', key: 'TI' },
];

const grades = [
	{ label: 'Pre-Jardin', key: 'Pre-Jardin' },
	{ label: 'Jardin', key: 'Jardin' },
	{ label: 'Transicion', key: 'Transicion' },
	{ label: 'Primero', key: '1°' },
	{ label: 'Segundo', key: '2°' },
	{ label: 'Tercero', key: '3°' },
	{ label: 'Cuarto', key: '4°' },
	{ label: 'Quinto', key: '5°' },
	{ label: 'Sexto', key: '6°' },
	{ label: 'Septimo', key: '7°' },
	{ label: 'Octavo', key: '8°' },
	{ label: 'Noveno', key: '9°' },
	{ label: 'Decimo', key: '10°' },
	{ label: 'Undecimo', key: '11°' }
];

const courses = [
	{ label: '101', key: '101' },
	{ label: '201', key: '201' },
	{ label: '301', key: '301' },
	{ label: '401', key: '401' },
	{ label: '501', key: '501' },
	{ label: '601', key: '601' },
]; // OBTENER DE BACK

const AddStudent = () => {
	const [_isLoading, setIsLoading] = useState(false);
	const [_error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		studentName: '',
		typeDoc: '',
		studentDoc: '',
		grade: '',
		course: '',
		id: '',
		responsibleDoc: '',
	});

	const handleChange = (
		name: string,
		value: string | React.ChangeEvent<HTMLInputElement>,
	) => {
		const actualValue =
			typeof value === 'string' ? value : value.target.value;

		setFormData((prev) => ({
			...prev,
			[name]: actualValue,
		}));
	};

	const handleSubmit = async () => {
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

		setIsLoading(true);
		setError(null);

		try {
			const studentData = {
				id: formData.id,
				name: formData.studentName,
				document: formData.studentDoc,
				extId: `EST-${formData.id}`, // Generamos un ID externo
				documentType: formData.typeDoc,
				courseName: formData.course,
				responsibleDocument: formData.responsibleDoc,
				active: true,
			};

			const response = await axios.post(
				'https://usermanagementbibliosoft-c0bhema4b0ewf4hh.eastus-01.azurewebsites.net/register/students',
				studentData,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			if (response.status === 200) {
				// Éxito
				alert('Estudiante registrado exitosamente');
				setFormData({
					studentName: '',
					typeDoc: '',
					studentDoc: '',
					grade: '',
					course: '',
					id: '',
					responsibleDoc: '',
				});
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				alert(err.response?.data?.message || 'Error al registrar el estudiante');
			} else {
				setError('Error al conectar con el servidor');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.mainContainer}>
			<UsersManagementLayout>
				<div className={styles.studentsPage}>
					<Title />
					<Divider className='my-6' />
					<div className={styles.flexContainer}>
						<div className={styles.column}>
							<SubtitleStudent />
							<br />
							<Input
								isRequired={true}
								key={'outside'}
								label='Nombres y Apellidos Completos'
								labelPlacement={'outside'}
								name={'studentName'}
								value={formData.studentName}
								onChange={(e) => handleChange('studentName', e)}
							/>{' '}
							<br />
							<Autocomplete
								isRequired={true}
								key={'outside'}
								className='max-w-xs'
								defaultItems={typesDocument}
								label='Tipo de Documento'
								labelPlacement={'outside'}
								name='typeDoc'
								value={formData.typeDoc}
								onSelectionChange={(key) =>
									handleChange('typeDoc', key.toString())
								}
							>
								{(item) => (
									<AutocompleteItem key={item.key}>
										{item.label}
									</AutocompleteItem>
								)}
							</Autocomplete>{' '}
							<br />
							<br />
							<Input
								isRequired={true}
								key={'outside'}
								label='Número de Documento'
								labelPlacement={'outside'}
								name='studentDoc'
								value={formData.studentDoc}
								onChange={(e) => handleChange('studentDoc', e)}
							/>{' '}
							<br />
							<Autocomplete
								isRequired={true}
								key={'outside'}
								className='max-w-xs'
								defaultItems={grades}
								label='Grado'
								labelPlacement={'outside'}
								name='grade'
								value={formData.grade}
								onSelectionChange={(key) =>
									handleChange('grade', key.toString())
								}
							>
								{(item) => (
									<AutocompleteItem key={item.key}>
										{item.label}
									</AutocompleteItem>
								)}
							</Autocomplete>{' '}
							<br />
							<br />
						</div>
						<div className={styles.verticalDivider} />
						<div className={styles.column}>
							<br />
							<br />
							<Autocomplete
								isRequired={true}
								key={'outside'}
								className='max-w-xs'
								defaultItems={courses}
								label='Curso'
								labelPlacement={'outside'}
								name='course'
								value={formData.course}
								onSelectionChange={(key) =>
									handleChange('course', key.toString())
								}
							>
								{(item) => (
									<AutocompleteItem key={item.key}>
										{item.label}
									</AutocompleteItem>
								)}
							</Autocomplete>{' '}
							<br />
							<br />
							<Input
								isRequired={true}
								key={'outside'}
								label='Codigo'
								labelPlacement={'outside'}
								name={'id'}
								value={formData.id}
								onChange={(e) => handleChange('id', e)}
							/>
							<br />
							<SubtitleResponsible />
							<br />
							<Input
								isRequired={true}
								description='El responsable ya se debe encontrar registrado en el sistema.'
								label='Número de Documento'
								labelPlacement='outside'
								name='responsibleDoc'
								value={formData.responsibleDoc}
								onChange={(e) =>
									handleChange('responsibleDoc', e)
								}
							/>
						</div>
					</div>
					<br />
					<Divider className='my-6' />
					<Button
						onClick={handleSubmit}
						className={styles.buttonCustom}
					>
						Adicionar Estudiante
					</Button>
				</div>
			</UsersManagementLayout>
		</div>
	);
};

export default AddStudent;
