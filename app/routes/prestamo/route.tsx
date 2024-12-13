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
import { type ChangeEvent, useState } from 'react';
import crearpPrestamo from './assets/crear-prestamo.png';
import devolverPrestamo from './assets/devolver-prestamo.png';
import listarPrestamo from './assets/listar-prestamos.png';
import styles from './prestamo.module.css';

/**
 * Title component renders a heading with a specific style.
 *
 * @returns {JSX.Element} A heading element with the text "¿Qué deseas realizar?".
 */
const Title = () => {
	return <h1 className={styles.title}>¿Qué Acción Deseas Realizar?</h1>;
};

/**
 * Component for creating a loan (prestamo).
 *
 * This component allows users to select a user and a book to create a loan.
 * It includes a modal that opens when the "Realizar un Préstamo" button is clicked.
 * The modal contains input fields for filtering users by ID, selecting a user, and selecting a book.
 *
 * @component
 * @name CreatePrestamo
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <CreatePrestamo />
 *
 * @remarks
 * - The component uses `useDisclosure` for managing the modal state.
 * - The `handleConfirmar` function logs the loan details to the console and closes the modal.
 * - The `usuarios` and `libros` arrays contain sample data for users and books respectively.
 * - The `usuariosFiltrados` array filters users based on the `filtroId` state.
 * - The modal contains input fields for filtering users by ID, selecting a user, and selecting a book.
 * - The "Confirmar Préstamo" button is disabled until both a user and a book are selected.
 *
 * @dependencies
 * - `useDisclosure` from Chakra UI for modal state management.
 * - `useState` from React for managing component state.
 * - `Button`, `Modal`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter`, `Input`, `Select`, and `SelectItem` components from a UI library.
 *
 * @state
 * @property {number | null} usuario - The selected user ID.
 * @property {number | null} libro - The selected book ID.
 * @property {string} filtroId - The filter string for user ID.
 *
 * @data
 * @property {Array<{id: number, nombre: string, email: string}>} usuarios - Sample data for users.
 * @property {Array<{id: number, titulo: string}>} libros - Sample data for books.
 *
 * @functions
 * @function handleConfirmar - Handles the confirmation of a loan.
 * @function setUsuario - Sets the selected user ID.
 * @function setLibro - Sets the selected book ID.
 * @function setFiltroId - Sets the filter string for user ID.
 */
const CreatePrestamo = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [usuario, setUsuario] = useState<number | null>(null);
	const [libro, setLibro] = useState<number | null>(null);
	const [filtroId, setFiltroId] = useState('');

	// Data de prueba
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

	//Data de Prueba
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

	/**
	 * Handles the confirmation of a loan.
	 * Logs the loan details (user and book) to the console and closes the modal.
	 *
	 * @function
	 * @name handleConfirmar
	 */
	const handleConfirmar = () => {
		console.log('Préstamo realizado:', { usuario, libro });
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

/**
 * ReturnPrestamo component handles the process of returning a loaned book.
 *
 * This component provides a user interface for returning a loaned book by scanning its QR code or barcode.
 * It includes a modal dialog for confirming the return and displays success or error messages based on the input validation.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered component.
 */
const ReturnPrestamo = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [libro, setLibro] = useState<number | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	/**
	 * Handles the confirmation of returning a loaned book.
	 *
	 * This function performs the following steps:
	 * 1. Validates the `libro` (book ID) to ensure it is not null and is a valid number.
	 * 2. If validation fails, sets an error message indicating that a valid book ID is required.
	 * 3. If validation passes, logs the return of the loaned book.
	 * 4. Sets a success message indicating the loan was successfully returned.
	 * 5. Resets the `libro` state to null.
	 * 6. Closes the confirmation dialog or modal.
	 *
	 * @returns {void}
	 */
	const handleConfirmar = () => {
		if (libro === null || Number.isNaN(libro)) {
			setErrorMessage('Por favor, ingresa un ID de libro válido.');
			return;
		}

		console.log('Préstamo devuelto:', libro);

		setSuccessMessage('Préstamo devuelto con éxito.');
		setLibro(null);
		onClose();
	};

	/**
	 * Handles the change event for an input element.
	 * Converts the input value to a number and updates the state accordingly.
	 * If the input value is not a valid number, it sets the libro state to null.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input element.
	 */
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
			<Modal isOpen={isOpen} onClose={onClose}>
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

/**
 * Component that renders a card for listing loans.
 *
 * @component
 * @returns {JSX.Element} A JSX element representing the loan listing card.
 *
 * @example
 * <ListPrestamo />
 *
 * @remarks
 * This component displays an image and a button that links to the loan listing page.
 *
 * @see {@link https://example.com/prestamo/listar} for more information on the loan listing page.
 */
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

/**
 * The `Modules` component renders a container with three sub-components:
 * `CreatePrestamo`, `ReturnPrestamo`, and `ListPrestamo`.
 *
 * @returns A JSX element containing the prestamo modules.
 */
const Modules = () => {
	return (
		<div className={styles.prestamoModules}>
			<CreatePrestamo />
			<ReturnPrestamo />
			<ListPrestamo />
		</div>
	);
};

/**
 * Prestamo component renders the main page for the "prestamo" route.
 * It includes a Title component and a Modules component.
 *
 * @returns {JSX.Element} The JSX code for the Prestamo page.
 */
const Prestamo = () => {
	return (
		<main className={styles.prestamoPage}>
			<Title />
			<Modules />
		</main>
	);
};

export default Prestamo;
