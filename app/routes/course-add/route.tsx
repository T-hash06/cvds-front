import {
	Button,
	Input,
	Divider
} from '@nextui-org/react';
import { useState } from 'react';
import UsersManagementLayout from '../../components/layouts/UsersManagementLayout';
import styles from './course.add.module.css';

const Title = () => {
	return <h1 className={styles.title}>Adicionar Curso</h1>;
};

const SubtitleCourse = () => {
	return <h2 className={styles.subtitle}>Información del Curso</h2>
};

const AddCourse = () => {
	const [formData, setFormData] = useState({
		courseName: '',
		gradeName: ''
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = () => {
		if (formData.courseName.trim() === '') {
			alert('Ingresa un nombre para el curso.');
			return;
		}
		if (formData.gradeName.trim() === '') {
			alert('Ingresa un grado para el curso.');
			return;
		}

		// Envío a API

		console.log('Datos del formulario:', formData);

		setFormData({
			courseName: '',
			gradeName: ''
		});

	};

	return (
		<div className={styles.mainContainer}>
			<UsersManagementLayout>
				<div className={styles.studentsPage}>
					<Title/>
					<Divider className="my-6"/>
					<div>
						<SubtitleCourse/> <br/>
						<Input
							isRequired
							key={"outside"}
							label="Nombre"
							labelPlacement={"outside"}
							name="courseName"
							className={styles.inputWideName}
							value={formData.courseName}
							onChange={handleChange}
						/> <br/>
						<Input
							isRequired
							key={"outside"}
							label="Grado"
							labelPlacement={"outside"}
							name="gradeName"
							className={styles.inputWide}
							value={formData.gradeName}
							onChange={handleChange}
						/> <br/>
					</div>
					<br/>
					<Divider className="my-6"/>
					<Button onClick={handleSubmit} className={styles.buttonCustom}>
						Adicionar Curso
					</Button>
				</div>
			</UsersManagementLayout>
		</div>
	);
};

export default AddCourse;