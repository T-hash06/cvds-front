import {
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
import { useState } from 'react';
import crearpPrestamo from './assets/crear-prestamo.png';
import devolverPrestamo from './assets/devolver-prestamo.png';
import listarPrestamo from './assets/listar-prestamos.png';
import styles from './prestamo.module.css';

const Title = () => {
	return <h1 className={styles.title}>¿Qué Acción Deseas Realizar?</h1>;
};

const CreatePrestamo = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [usuario, setUsuario] = useState<number | null>(null);
	const [libro, setLibro] = useState<number | null>(null);
	const [filtroId, setFiltroId] = useState('');

	const usuarios = [
		{ id: 1, nombre: 'Juan Pérez', email: 'juan.perez@example.com' },
		{ id: 2, nombre: 'María García', email: 'maria.garcia@example.com' },
		{
			id: 3,
			nombre: 'Carlos Rodríguez',
			email: 'carlos.rodriguez@example.com',
		},
		{ id: 4, nombre: 'Ana Martínez', email: 'ana.martinez@example.com' },
		{ id: 5, nombre: 'Luis González', email: 'luis.gonzalez@example.com' },
		{ id: 6, nombre: 'Sofía López', email: 'sofia.lopez@example.com' },
		{
			id: 7,
			nombre: 'Diego Fernández',
			email: 'diego.fernandez@example.com',
		},
	];

	const libros = [
		{ id: 1, titulo: 'Cien años de soledad' },
		{ id: 2, titulo: 'El principito' },
		{ id: 3, titulo: '1984' },
		{ id: 4, titulo: 'La sombra del viento' },
	];

	const usuariosFiltrados = usuarios.filter(
		(usuario) =>
			filtroId === '' || usuario.id.toString().includes(filtroId),
	);

	// aqui es donde se llama a la api para crear un prestamo
	const handleConfirmar = async () => {
		if (usuario && libro) {
			const url =
				'https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/prestamos';
			const loanData = {
				idEstudiante: usuario,
				idLibro: libro,
				fechaPrestamo: new Date().toISOString(),
				estado: 'Prestado',
			};

			try {
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(loanData),
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const data = await response.json();
				console.log('Préstamo realizado:', data);
				onClose();
			} catch (error) {
				console.error('Error realizando el préstamo:', error);
			}
		}
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

						<Input
							type='text'
							label='Filtrar por ID de Usuario'
							placeholder='Ingrese ID'
							value={filtroId}
							onChange={(e) => setFiltroId(e.target.value)}
							className='mb-4'
						/>

						<Select
							label='Seleccionar Usuario'
							placeholder='Buscar usuario'
							variant='bordered'
							onSelectionChange={(keys) =>
								setUsuario(Number(Array.from(keys)[0]))
							}
							selectedKeys={usuario ? [usuario.toString()] : []}
							className='mb-4'
						>
							{usuariosFiltrados.map((user) => (
								<SelectItem
									key={user.id}
									value={user.id}
									textValue={`${user.nombre} (${user.email})`}
								>
									<div className='flex flex-col'>
										<span className='font-bold'>
											{user.nombre}
										</span>
										<span className='text-gray-500 text-small'>
											ID: {user.id} | {user.email}
										</span>
									</div>
								</SelectItem>
							))}
						</Select>

						<Select
							label='Seleccionar Libro'
							placeholder='Elige un libro'
							variant='bordered'
							onSelectionChange={(keys) =>
								setLibro(Number(Array.from(keys)[0]))
							}
							selectedKeys={libro ? [libro.toString()] : []}
						>
							{libros.map((libroItem) => (
								<SelectItem
									key={libroItem.id}
									value={libroItem.id}
								>
									{libroItem.titulo}
								</SelectItem>
							))}
						</Select>
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
							isDisabled={!usuario || !libro}
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
