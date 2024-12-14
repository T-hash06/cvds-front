import { useNavigate } from '@remix-run/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
	Button,
	Checkbox,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Pagination,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/react';
import MainLayout from '../../components/layouts/MainLayout';

const API_URL =
	'https://backbibliosoft-hefxcthhhadjgxb0.canadacentral-01.azurewebsites.net';

interface Ejemplar {
	id?: string;
	estado: string;
	disponible: boolean;
	libro: string;
	codigoBarras: string;
	barcodeURL?: string;
}

let nombreLibro = '';

const EjemplaresPage = () => {
	const navigate = useNavigate();
	const libroId = localStorage.getItem('libroId');
	nombreLibro = localStorage.getItem('nombreLibro') ?? '';

	useEffect(() => {
		if (!libroId) {
			navigate('/books');
		}
	}, [libroId, navigate]);

	const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [page, setPage] = useState(1);
	const [rowsPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedEjemplar, setSelectedEjemplar] = useState<Ejemplar | null>(
		null,
	);

	const [newEjemplar, setNewEjemplar] = useState<Ejemplar>({
		estado: '',
		disponible: false,
		libro: libroId ?? '',
		codigoBarras: '',
	});

	useEffect(() => {
		fetchEjemplares();
	}, []);

	const fetchEjemplares = async () => {
		try {
			const response = await axios.get(
				`${API_URL}/ejemplares/libro/${libroId}`,
				{
					params: { page: page - 1, size: rowsPerPage },
				},
			);
			const ejemplaresData = response.data;

			// Fetch barcode URLs for each ejemplar
			const ejemplaresWithBarcode = await Promise.all(
				ejemplaresData.map(async (ejemplar: Ejemplar) => {
					let barcodeURL = '';
					if (ejemplar.codigoBarras) {
						try {
							const barcodeResponse = await axios.get(
								`${API_URL}/blobs/blob-url/${ejemplar.codigoBarras}`,
							);
							barcodeURL = barcodeResponse.data;
						} catch (error) {
							console.error(
								`Error fetching barcode for ejemplar ${ejemplar.id}:`,
								error,
							);
						}
					}
					return { ...ejemplar, barcodeURL };
				}),
			);

			setEjemplares(ejemplaresWithBarcode);
			setTotalPages(Math.ceil(response.data.length / rowsPerPage));
		} catch (error) {
			console.error('Error al obtener ejemplares:', error);
			toast.error('No se pudo cargar los ejemplares');
		}
	};

	const handleEditClick = (ejemplar: Ejemplar) => {
		setSelectedEjemplar(ejemplar);
		setShowEditModal(true);
	};

	const handleEditChange = (
		field: keyof Ejemplar,
		value: string | boolean,
	) => {
		if (selectedEjemplar) {
			setSelectedEjemplar({ ...selectedEjemplar, [field]: value });
		}
	};

	const handleAddEjemplar = async () => {
		try {
			const ejemplarToAdd = {
				...newEjemplar,
				libro: libroId,
			};
			await axios.post(`${API_URL}/ejemplares`, ejemplarToAdd);
			setShowAddModal(false);
			setNewEjemplar({
				estado: '',
				disponible: false,
				libro: libroId || '',
				codigoBarras: '',
			});
			fetchEjemplares();
			toast.success('Ejemplar añadido satisfactoriamente');
		} catch (error) {
			console.error('Error al añadir el ejemplar:', error);
			toast.error('No se pudo añadir el ejemplar');
		}
	};

	const handleSaveEdit = async () => {
		if (selectedEjemplar) {
			try {
				const ejemplarToUpdate = {
					...selectedEjemplar,
					libro: libroId,
				};
				await axios.put(
					`${API_URL}/ejemplares/${selectedEjemplar.id}`,
					ejemplarToUpdate,
				);
				setShowEditModal(false);
				setSelectedEjemplar(null);
				fetchEjemplares();
				toast.success('Ejemplar editado satisfactoriamente');
			} catch (error) {
				console.error('Error al editar el ejemplar:', error);
				toast.error('No se pudo editar el ejemplar');
			}
		}
	};

	const handleDeleteEjemplar = async (id: string) => {
		try {
			await axios.delete(`${API_URL}/ejemplares/${id}`);
			fetchEjemplares();
			toast.success('Ejemplar eliminado satisfactoriamente');
		} catch (error) {
			console.error('Error al eliminar el ejemplar:', error);
			toast.error('No se pudo eliminar el ejemplar');
		}
	};

	const handleScanEjemplar = async () => {
		try {
			const response = await axios.get(
				`${API_URL}/ejemplares/${searchTerm}`,
			);
			const ejemplar = response.data;

			// Fetch barcode URL
			let barcodeURL = '';
			if (ejemplar.codigoBarras) {
				try {
					const barcodeResponse = await axios.get(
						`${API_URL}/blobs/blob-url/${ejemplar.codigoBarras}`,
					);
					barcodeURL = barcodeResponse.data;
				} catch (error) {
					console.error(
						`Error fetching barcode for ejemplar ${ejemplar.id}:`,
						error,
					);
				}
			}
			setEjemplares([{ ...ejemplar, barcodeURL }]);
			toast.success('Ejemplar encontrado');
		} catch (error) {
			console.error('Error al escanear el ejemplar:', error);
			toast.error('No se pudo encontrar el ejemplar');
		}
	};

	const handleClearFilters = () => {
		setSearchTerm('');
		fetchEjemplares();
	};

	const renderActions = (ejemplar: Ejemplar) => (
		<Dropdown>
			<DropdownTrigger>
				<Button isIconOnly={true} size='sm' className='button-primary'>
					⋮
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				onAction={(key) => {
					if (key === 'edit') {
						handleEditClick(ejemplar);
					} else if (key === 'delete') {
						if (
							window.confirm(
								'¿Estás seguro de eliminar este ejemplar?',
							)
						) {
							if (ejemplar.id) {
								handleDeleteEjemplar(ejemplar.id);
							}
						}
					}
				}}
			>
				<DropdownItem key='edit'>Editar</DropdownItem>
				<DropdownItem key='delete'>Eliminar</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);

	return (
		<MainLayout>
			<div className='p-6 bg-blue-50 min-h-screen'>
				<div className='flex items-center justify-between mb-6'>
					<Button
						className='button-secondary'
						onClick={() => navigate('/books')}
					>
						← Volver a Libros
					</Button>
					<h1 className='text-3xl font-bold text-blue-700'>
						Gestión de Ejemplares
					</h1>
					<Button
						className='button-primary'
						onClick={() => setShowAddModal(true)}
					>
						Añadir Ejemplar
					</Button>
				</div>

				<div className='flex gap-4 mb-6'>
					<Input
						className='input-search'
						placeholder='Escanear Ejemplar...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Button
						className='button-primary'
						onClick={handleScanEjemplar}
					>
						Buscar
					</Button>
					<Button
						className='button-secondary'
						onClick={handleClearFilters}
					>
						X
					</Button>
				</div>
				<div className='p-6 bg-white shadow-md rounded-lg mb-6'>
					<h1 className='text-2xl font-semibold text-blue-700'>
						{nombreLibro}
					</h1>
				</div>
				<Table aria-label='Lista de ejemplares'>
					<TableHeader>
						<TableColumn className='table-header'>
							Estado
						</TableColumn>
						<TableColumn className='table-header'>
							Disponible
						</TableColumn>
						<TableColumn className='table-header'>
							Acciones
						</TableColumn>
						<TableColumn className='table-header'>
							Código de Barras
						</TableColumn>
					</TableHeader>
					<TableBody>
						{ejemplares.map((ejemplar) => (
							<TableRow key={ejemplar.id} className='table-row'>
								<TableCell>{ejemplar.estado}</TableCell>
								<TableCell>
									<Checkbox
										isSelected={ejemplar.disponible}
										isDisabled={true}
									/>
								</TableCell>
								<TableCell>{renderActions(ejemplar)}</TableCell>
								<TableCell>
									{ejemplar.barcodeURL ? (
										<a
											href={ejemplar.barcodeURL}
											target='_blank'
											rel='noopener noreferrer'
										>
											<img
												src={ejemplar.barcodeURL}
												alt='Código de Barras'
												width='400'
												height='300'
											/>
										</a>
									) : (
										'No disponible'
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<div className='flex justify-center mt-6'>
					<Pagination
						total={totalPages}
						page={page}
						onChange={(newPage) => {
							setPage(newPage);
							fetchEjemplares();
						}}
					/>
				</div>

				<ToastContainer
					position='top-right'
					autoClose={3000}
					hideProgressBar={true}
					newestOnTop={true}
					closeOnClick={true}
					pauseOnHover={true}
					draggable={true}
				/>

				{/* Add Ejemplar Modal */}
				<Modal isOpen={showAddModal} onOpenChange={setShowAddModal}>
					<ModalContent>
						<ModalHeader>
							<h2>Añadir Nuevo Ejemplar</h2>
						</ModalHeader>
						<ModalBody>
							<Input
								label='Estado'
								value={newEjemplar.estado}
								onChange={(e) =>
									setNewEjemplar({
										...newEjemplar,
										estado: e.target.value,
									})
								}
							/>
							<Checkbox
								isSelected={newEjemplar.disponible}
								onChange={(e) =>
									setNewEjemplar({
										...newEjemplar,
										disponible: e.target.checked,
									})
								}
							>
								Disponible
							</Checkbox>
						</ModalBody>
						<ModalFooter>
							<Button
								className='button-primary'
								onClick={handleAddEjemplar}
							>
								Confirmar
							</Button>
							<Button
								className='button-secondary'
								onClick={() => setShowAddModal(false)}
							>
								Cancelar
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

				{/* Edit Ejemplar Modal */}
				{selectedEjemplar && (
					<Modal
						isOpen={showEditModal}
						onOpenChange={setShowEditModal}
					>
						<ModalContent>
							<ModalHeader>
								<h2>Editar Ejemplar</h2>
							</ModalHeader>
							<ModalBody>
								<Input
									label='Estado'
									value={selectedEjemplar.estado}
									onChange={(e) =>
										handleEditChange(
											'estado',
											e.target.value,
										)
									}
								/>
								<Checkbox
									isSelected={selectedEjemplar.disponible}
									onChange={(e) =>
										handleEditChange(
											'disponible',
											e.target.checked,
										)
									}
								>
									Disponible
								</Checkbox>
							</ModalBody>
							<ModalFooter>
								<Button
									className='button-primary'
									onClick={handleSaveEdit}
								>
									Confirmar
								</Button>
								<Button
									className='button-secondary'
									onClick={() => setShowEditModal(false)}
								>
									Cancelar
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				)}
			</div>
		</MainLayout>
	);
};

export default EjemplaresPage;
