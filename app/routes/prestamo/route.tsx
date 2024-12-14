import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	useDisclosure,
} from '@nextui-org/react';
import MainLayout from 'app/components/layouts/MainLayout';
import type React from 'react';
import { useEffect, useState } from 'react';
import crearpPrestamo from './assets/crear-prestamo.png';
import devolverPrestamo from './assets/devolver-prestamo.png';
import listarPrestamo from './assets/listar-prestamos.png';
import styles from './prestamo.module.css';
import axiosIntance from '../../shared/hooks/axiosIntance';


const Title = () => {
	return <h1 className={styles.title}>¿Qué Acción Deseas Realizar?</h1>;
};

const CreatePrestamo = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [usuarios, setUsuarios] = useState([]);
	const [libros, setLibros] = useState([]);

	const fetchBooks = async () => {
		const response = await axiosIntance.get('/libros');
		return response.data.content;
	}

	const getLibros = async () => {
		const libros = await fetchBooks();
		return libros;
	}
	
	const fetchUsers = async () => {
		const response = await axiosIntance.get('/users/students?pageNumber=1&pageSize=100');
		return response.data.content;
	}

	const getUsuarios = async () => {
		const usuarios = await fetchUsers();
		console.log("Usuarios" + usuarios);
		return usuarios;
	}


	useEffect(() => {
		const fetchLibros = async () => {
			const librosData = await getLibros();
			setLibros(librosData);
		};
		const fetchUsuarios = async () => {
			const usuariosData = await getUsuarios();
			setUsuarios(usuariosData);
		};
		fetchUsuarios();
		fetchLibros();
	}, []);

	/**
	 * Handles the confirmation of a loan.
	 * Logs the loan details (user and book) to the console and closes the modal.
	 *
	 * @function
	 * @name handleConfirmar
	 */
	const handleConfirmar = () => {
		onClose();
	};

	return (
		<>
			<div className={styles.prestamoCard}>
				<img
					src={crearpPrestamo}
					alt='Realizar un préstamo'
					className={styles.prestamoIcon}
				/>
				<Button
					onClick={onOpen}
					color='secondary'
					radius='full'
					variant='light'
				>
					<h2 className={styles.prestamoCardTitle}>
						Realizar un Préstamo
					</h2>
				</Button>
			</div>

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				placement='center'
				backdrop='blur'
				size='md'
			>
				<ModalContent>
					<ModalHeader className='flex flex-col gap-1'>
						<h2 className='text-xl font-bold'>Realizar Préstamo</h2>
					</ModalHeader>
					<ModalBody>
						<p className='text-gray-600 mb-4'>
							Por favor, selecciona el usuario y el libro para el
							préstamo.
						</p>

						<Autocomplete
							className='mb-4'
							defaultItems={usuarios}
							placeholder='Buscar por ID del estudiante'
							label='Seleccionar Estudiante'
						>
							{/* {(item) => <AutocompleteItem key={item.id}>{item.name} ({item.id})</AutocompleteItem>} */}
						</Autocomplete>

						<Autocomplete
							className='mb-4'
							defaultItems={libros}
							placeholder='Buscar por ID de libro'
							label='Seleccionar Libro'
						>
							{(item) => <AutocompleteItem key={item.id}>{item.nombreLibro}</AutocompleteItem>}
						</Autocomplete>
					</ModalBody>
					<ModalFooter>
						<Button
							color='danger'
							variant='light'
							onPress={onClose}
						>
							Cancelar
						</Button>
						<Button
							color='primary'
							onPress={handleConfirmar}
							//isDisabled={!usuario || !libro}
						>
							Confirmar Préstamo
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

const ReturnPrestamo = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [libro, setLibro] = useState<number | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleConfirmar = async () => {
		if (libro !== null) {
			const url = `https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/prestamos/${libro}/devolver`;

			try {
				const response = await fetch(url, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const data = await response.json();
				console.log('Préstamo devuelto:', data);
				setSuccessMessage('Préstamo devuelto con éxito.');
				setLibro(null);
				onClose();
			} catch (error) {
				console.error('Error devolviendo el préstamo:', error);
			}
		} else {
			setErrorMessage('Por favor, ingresa un ID de libro válido.');
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const numberValue = Number(value);

		if (!Number.isNaN(numberValue)) {
			setLibro(numberValue);
			setErrorMessage(null);
		} else {
			setLibro(null);
		}
	};

	return (
		<>
			<div className={styles.prestamoCard}>
				<img
					src={devolverPrestamo}
					alt='Devolver un préstamo'
					className={styles.prestamoIcon}
				/>
				<Button
					onClick={onOpen}
					color='secondary'
					radius='full'
					variant='light'
				>
					<h2 className={styles.prestamoCardTitle}>
						Devolver Préstamo
					</h2>
				</Button>
			</div>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				placement='center'
				backdrop='blur'
				size='md'
			>
				<ModalContent>
					<>
						<ModalHeader>Devolver Préstamo</ModalHeader>
						<ModalBody>
							<p>
								Por favor escanea el código QR o el código de
								barras del libro que deseas devolver.
							</p>
							<Input
								type='text'
								label='Id del libro'
								placeholder='Escribe el código aquí'
								className='mb-4'
								isRequired={true}
								isClearable={true}
								description='Escanea el código de barras o el código QR del libro que deseas devolver.'
								errorMessage={errorMessage}
								isInvalid={!!errorMessage}
								onChange={handleInputChange}
							/>
							{successMessage && (
								<p className='success-message'>
									{successMessage}
								</p>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								color='danger'
								variant='light'
								onClick={onClose}
							>
								Cancelar
							</Button>
							<Button
								color='primary'
								onClick={handleConfirmar}
								isDisabled={
									libro === null || Number.isNaN(libro)
								}
							>
								Confirmar
							</Button>
						</ModalFooter>
					</>
				</ModalContent>
			</Modal>
		</>
	);
};

const ListPrestamo = () => {
	return (
		<div className={styles.prestamoCard}>
			<img
				src={listarPrestamo}
				alt='Listar préstamos'
				className={styles.prestamoIcon}
			/>
			<Button color='secondary' radius='full' variant='light'>
				<a
					href='/prestamo/listar'
					className={styles.prestamoButtonLink}
				>
					<h2 className={styles.prestamoCardTitle}>
						Lista de préstamos
					</h2>
				</a>
			</Button>
		</div>
	);
};

const Modules = () => {
	return (
		<div className={styles.prestamoModules}>
			<CreatePrestamo />
			<ReturnPrestamo />
			<ListPrestamo />
		</div>
	);
};

const Prestamo = () => {
	return (
		<MainLayout>
			<main className={styles.prestamoPage}>
				<Title />
				<Modules />
			</main>
		</MainLayout>
	);
};

export default Prestamo;
