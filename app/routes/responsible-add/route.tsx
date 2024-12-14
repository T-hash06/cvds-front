import {
	Button,
	Input,
	Divider
} from '@nextui-org/react';
import { useState } from 'react';
import UsersManagementLayout from '../../components/layouts/UsersManagementLayout';
import styles from './responsible.add.module.css';

const Title = () => {
	return <h1 className={styles.title}>Adicionar Responsable</h1>;
};

const SubtitleResponsible = () => {
	return <h2 className={styles.subtitle}>Información del Responsable</h2>
};

const AddResponsible = () => {
	const [formData, setFormData] = useState({
		responsibleName: '',
		responsibleDoc: '',
		placeDoc: '',
		email: '',
		cellNumber: ''
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = () => {
		if (formData.responsibleName.trim() === '') {
			alert('Ingresa un nombre de un responsable.');
			return;
		}
		if (formData.responsibleDoc.trim() === '') {
			alert('Ingresa el documento del responsable.');
			return;
		}
		if (formData.placeDoc.trim() === '') {
			alert('Ingresa el lugar de expedición del documento del responsable.');
			return;
		}
		if (formData.email.trim() === '') {
			alert('Ingresa el correo electronico del responsable.');
			return;
		}
		if (formData.cellNumber.trim() === '') {
			alert('Ingresa el numero de telefono del responsable.');
			return;
		}

		// Envío a API

		console.log('Datos del formulario:', formData);

		setFormData({
			responsibleName: '',
			responsibleDoc: '',
			placeDoc: '',
			email: '',
			cellNumber: ''
		});

	};

	return (
		<div className={styles.mainContainer}>
			<UsersManagementLayout>
				<div className={styles.studentsPage}>
					<Title/>
					<Divider className="my-6"/>
					<div>
						<SubtitleResponsible/> <br/>
						<Input
							isRequired
							key={"outside"}
							label="Nombres y Apellidos Completos"
							labelPlacement={"outside"}
							name="responsibleName"
							className={styles.inputWideName}
							value={formData.responsibleName}
							onChange={handleChange}
						/> <br/>
					</div>
					<div className={styles.flexContainer}>
						<div className={styles.column}>
							<Input
								isRequired
								key={"outside"}
								label="Número de Documento"
								labelPlacement={"outside"}
								name="responsibleDoc"
								className={styles.inputWide}
								value={formData.responsibleDoc}
								onChange={handleChange}
							/> <br/>
							<Input
								isRequired
								key={"outside"}
								label="Correo Electronico"
								labelPlacement={"outside"}
								name="email"
								className={styles.inputWide}
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div className={styles.verticalDivider}> </div>
						<div className={styles.column}>
							<Input
								isRequired
								key={"outside"}
								label="Lugar de Expedicion"
								labelPlacement={"outside"}
								name="placeDoc"
								className={styles.inputWide}
								value={formData.placeDoc}
								onChange={handleChange}
							/> <br/>
							<Input
								isRequired
								label="Número de Telefono"
								labelPlacement="outside"
								name="cellNumber"
								className={styles.inputWide}
								value={formData.cellNumber}
								onChange={handleChange}
							/> <br/>
						</div>
					</div>
					<br/>
					<Divider className="my-6"/>
					<Button onClick={handleSubmit} className={styles.buttonCustom}>
						Adicionar Responsable
					</Button>
				</div>
			</UsersManagementLayout>
		</div>
	);
};

export default AddResponsible;