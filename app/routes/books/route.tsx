import { useNavigate } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from '../../components/layouts/MainLayout';
import axiosIntance from '../../shared/hooks/axiosIntance';

import {
	Button,
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

const API_URL = 'https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/';

if (typeof window !== 'undefined') {
	localStorage.setItem(
		'token',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVjaSIsInJvbGUiOiJzdHVkZW50IiwiaWQiOiJhODA2YTNmNy01MDE2LTQ5YzAtOTE4Yy03M2YyMDc3MmEyZjIiLCJpYXQiOjE3MzQxMDE2MjgsImV4cCI6MTczNDE4ODAyOH0.zG9gaySV6WYexx6Hc3bMjdpca1gn5BiIGxaUTQZ_IH4',
	);
	const token = localStorage.getItem('token');
	if (token) {
		// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}
}

interface Libro {
	id?: string;
	nombreLibro: string;
	autor: string;
	editor: string;
	edicion: string;
	isbn: string;
	sinopsis: string;
	anioPublicacion: string;
}

const BooksPage = () => {
	const [libros, setLibros] = useState<Libro[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchBy, setSearchBy] = useState('Autor');
	const [page, setPage] = useState(1);
	const [rowsPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);

	const [newLibro, setNewLibro] = useState<Libro>({
		nombreLibro: '',
		autor: '',
		editor: '',
		edicion: '',
		isbn: '',
		sinopsis: '',
		anioPublicacion: '',
	});

	const capitalizeFirstLetter = (text: string) => {
		return text.charAt(0).toUpperCase() + text.slice(1);
	};
	

	const navigate = useNavigate();

	const fetchLibros = useCallback(async () => {
		try {
			const response = await axiosIntance.get(`libros`, {
				params: { page: page - 1, size: rowsPerPage },
			});
			setLibros(response.data.content);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.error('Error al obtener libros:', error);
			toast.error('No se pudo cargar los libros');
		}
	}, [page, rowsPerPage]);

	const searchLibros = useCallback(async () => {
		try {
			const response = await axiosIntance.get(
				`busquedas/${searchTerm}/parametro/${searchBy}/pagina/${
					page - 1
				}/tamano/${rowsPerPage}`,
			);
			setLibros(response.data.content);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.error('Error al buscar libros:', error);
			toast.error('No se pudo realizar la búsqueda');
		}
	}, [searchTerm, searchBy, page, rowsPerPage]);

	useEffect(() => {
		if (searchTerm) {
			searchLibros();
		} else {
			fetchLibros();
		}
	}, [searchTerm, fetchLibros, searchLibros]);

	const resetFilters = () => {
		setSearchTerm('');
		setSearchBy('autor');
		setPage(1);
		fetchLibros();
		toast.info('Filtros restablecidos');
	};

	const deleteLibro = async (id: string) => {
		try {
			await axiosIntance.delete(`libros/${id}`);
			if (searchTerm) {
				searchLibros();
			} else {
				fetchLibros();
			}
			toast.success('Libro eliminado satisfactoriamente');
		} catch (error) {
			console.error('Error al eliminar el libro:', error);
			toast.error('No se pudo eliminar el libro');
		}
	};

	const handleEditClick = (libro: Libro) => {
		setSelectedLibro(libro);
		setShowEditModal(true);
	};

	const handleEditChange = (field: keyof Libro, value: string) => {
		if (selectedLibro) {
			setSelectedLibro({ ...selectedLibro, [field]: value });
		}
	};

	const handleSaveEdit = async () => {
		if (selectedLibro) {
			try {
				await axiosIntance.put(
					`libros/${selectedLibro.id}`,
					selectedLibro,
				);
				setShowEditModal(false);
				setSelectedLibro(null);
				if (searchTerm) {
					searchLibros();
				} else {
					fetchLibros();
				}
				toast.success('Libro editado satisfactoriamente');
			} catch (error) {
				console.error('Error al editar el libro:', error);
				toast.error('No se pudo editar el libro');
			}
		}
	};

	const handleAddLibro = async () => {
		try {
			await axiosIntance.post(`libros`, newLibro);
			setShowAddModal(false);
			setNewLibro({
				nombreLibro: '',
				autor: '',
				editor: '',
				edicion: '',
				isbn: '',
				sinopsis: '',
				anioPublicacion: '',
			});
			if (searchTerm) {
				setPage(1);
				searchLibros();
			} else {
				fetchLibros();
			}
			toast.success('Libro añadido satisfactoriamente');
		} catch (error) {
			console.error('Error al añadir el libro:', error);
			toast.error('No se pudo añadir el libro');
		}
	};

	const renderActions = (libro: Libro) => (
		<Dropdown>
			<DropdownTrigger>
				<Button isIconOnly={true} size='sm' className='button-primary'>
					⋮
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				onAction={(key) => {
					if (key === 'edit') {
						handleEditClick(libro);
					} else if (key === 'delete') {
						if (
							window.confirm(
								`¿Estás seguro de eliminar "${libro.nombreLibro}"?`,
							)
						) {
							if (libro.id) {
								deleteLibro(libro.id);
							}
						}
					} else if (key === 'ejemplares') {
						if (libro.id) {
							localStorage.setItem('libroId', libro.id);
							localStorage.setItem('nombreLibro', libro.nombreLibro);
							navigate('/ejemplares');
						}
					} else if (key === 'categorias') {
						if (libro.id) {
							localStorage.setItem('libroId', libro.id);
							localStorage.setItem('nombreLibro', libro.nombreLibro);
							navigate('/categorias');
						}
					}
				}}
			>
				<DropdownItem key='edit'>Editar</DropdownItem>
				<DropdownItem key='delete'>Eliminar</DropdownItem>
				<DropdownItem key='ejemplares'>Ejemplares</DropdownItem>
				<DropdownItem key='categorias'>Categorías</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);

	return (
		<MainLayout>
			<div className='p-6 bg-blue-50 min-h-screen'>
				<div className='flex items-center justify-between mb-6'>
					<h1 className='text-3xl font-bold text-blue-700'>
						Gestión de Libros
					</h1>
					<div className='flex gap-4 ml-auto'>
						<Button
							className='button-primary'
							onClick={() => setShowAddModal(true)}
						>
							Añadir Libro
						</Button>
						<Button
							className='button-primary'
							onClick={() => navigate('/categorias')}
						>
							Categoría
						</Button>
					</div>
				</div>
					

	
					<div className='flex gap-4 items-center mb-6'>
						<Input
							isClearable
							placeholder='Buscar...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<Dropdown>
							<DropdownTrigger>
								<Button>{searchBy}</Button>
							</DropdownTrigger>
							<DropdownMenu
								onAction={(key) => {
									const itemTexts: { [key in 'autor' | 'nombreLibro' | 'editor' | 'sinopsis']: string } = {
									autor: 'Autor',
									nombreLibro: 'Nombre',
									editor: 'Editor',
									sinopsis: 'Sinopsis',
									};
									const selectedLabel = itemTexts[key as 'autor' | 'nombreLibro' | 'editor' | 'sinopsis'];
									if (selectedLabel) {
									setSearchBy(capitalizeFirstLetter(selectedLabel));
									}
								}}
							>
								<DropdownItem key='autor'>Autor</DropdownItem>
								<DropdownItem key='nombreLibro'>Nombre</DropdownItem>
								<DropdownItem key='editor'>Editor</DropdownItem>
								<DropdownItem key='sinopsis'>Sinopsis</DropdownItem>
							</DropdownMenu>
						</Dropdown>
						<Button onClick={resetFilters}>Restablecer Filtros</Button>
					</div>
	
					<Table>
						<TableHeader>
							<TableColumn>Nombre</TableColumn>
							<TableColumn>Autor</TableColumn>
							<TableColumn>Editor</TableColumn>
							<TableColumn>Edición</TableColumn>
							<TableColumn>Año</TableColumn>
							<TableColumn>Sinopsis</TableColumn>
							<TableColumn>Acciones</TableColumn>
						</TableHeader>
						<TableBody>
							{libros.map((libro) => (
								<TableRow key={libro.id}>
									<TableCell>{libro.nombreLibro}</TableCell>
									<TableCell>{libro.autor}</TableCell>
									<TableCell>{libro.editor}</TableCell>
									<TableCell>{libro.edicion}</TableCell>
									<TableCell>{libro.anioPublicacion}</TableCell>
									<TableCell>{libro.sinopsis}</TableCell>
									<TableCell>{renderActions(libro)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
	
					<Pagination
						total={totalPages}
						page={page}
						onChange={(newPage) => setPage(newPage)}
					/>
	
					{/* Modal para añadir libro */}
					<Modal
						isOpen={showAddModal}
						onClose={() => setShowAddModal(false)}
					>
						<ModalContent>
							<ModalHeader>Añadir Libro</ModalHeader>
							<ModalBody>
								{Object.keys(newLibro).map((key) => (
									<Input
										key={key}
										label={key}
										value={newLibro[key as keyof Libro]}
										onChange={(e) =>
											setNewLibro({
												...newLibro,
												[key]: e.target.value,
											})
										}
									/>
								))}
							</ModalBody>
							<ModalFooter>
								<Button onClick={() => setShowAddModal(false)}>
									Cancelar
								</Button>
								<Button onClick={handleAddLibro}>
									Añadir
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
	
					{/* Modal para editar libro */}
					<Modal
						isOpen={showEditModal}
						onClose={() => setShowEditModal(false)}
					>
						<ModalContent>
							<ModalHeader>Editar Libro</ModalHeader>
							<ModalBody>
								{selectedLibro &&
									Object.keys(selectedLibro).map((key) => (
										<Input
											key={key}
											label={key}
											value={
												selectedLibro[key as keyof Libro]
											}
											onChange={(e) =>
												handleEditChange(
													key as keyof Libro,
													e.target.value,
												)
											}
										/>
									))}
							</ModalBody>
							<ModalFooter>
								<Button onClick={() => setShowEditModal(false)}>
									Cancelar
								</Button>
								<Button onClick={handleSaveEdit}>
									Guardar
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</div>
				<ToastContainer />
			</MainLayout>
		);
	};
	
	export default BooksPage;
	
