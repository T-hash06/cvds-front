import {
	Button,
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
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "@remix-run/react";
import MainLayout from '../../components/layouts/MainLayout';
import axiosIntance from '../../shared/hooks/axiosIntance';

const API_URL = 'https://backbibliosoft-hefxcthhhadjgxb0.canadacentral-01.azurewebsites.net';

interface Categoria {
	id?: string;
	nombre: string;
}

interface Subcategoria {
	idSubcategoria?: string;
	nombre: string;
	categorias?: Categoria[];
}

const CategoriasPage = () => {
	const navigate = useNavigate();

	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [selectedCategoria, setSelectedCategoria] =
		useState<Categoria | null>(null);
	const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
	const [showSubcategoriasModal, setShowSubcategoriasModal] = useState(false);
	const [showAddSubcategoriaModal, setShowAddSubcategoriaModal] =
		useState(false);
	const [showEditSubcategoriaModal, setShowEditSubcategoriaModal] =
		useState(false);
	const [showAddCategoriaModal, setShowAddCategoriaModal] = useState(false);
	const [showEditCategoriaModal, setShowEditCategoriaModal] = useState(false);
	const [newCategoria, setNewCategoria] = useState<Categoria>({ nombre: '' });
	const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);
	const [newSubcategoria, setNewSubcategoria] = useState<Subcategoria>({
		nombre: '',
	});
	const [editSubcategoria, setEditSubcategoria] =
		useState<Subcategoria | null>(null);
	const [page, setPage] = useState(1);
	const rowsPerPage = 5;

	useEffect(() => {
		fetchCategorias();
	}, []);

	const fetchCategorias = async () => {
		try {
			const response = await axiosIntance.get(`${API_URL}/categorias`);
			setCategorias(response.data);
		} catch (error) {
			console.error('Error al obtener categorías:', error);
			toast.error('No se pudo cargar las categorías');
		}
	};

	const handleAddCategoria = async () => {
		try {
			const response = await axiosIntance.post(
				`${API_URL}/categorias`,
				newCategoria,
			);
			const categoria = response.data;
			setCategorias([...categorias, categoria]);
			setShowAddCategoriaModal(false);
			setNewCategoria({ nombre: '' });
			toast.success('Categoría añadida satisfactoriamente');
		} catch (error) {
			console.error('Error al agregar categoría:', error);
			toast.error('No se pudo agregar la categoría');
		}
	};

	const handleEditCategoria = async () => {
		if (editCategoria?.id) {
			try {
				const response = await axiosIntance.put(
					`${API_URL}/categorias/${editCategoria.id}`,
					editCategoria,
				);
				const updatedCategoria = response.data;
				setCategorias(
					categorias.map((cat) =>
						cat.id === updatedCategoria.id ? updatedCategoria : cat,
					),
				);
				setShowEditCategoriaModal(false);
				setEditCategoria(null);
				toast.success('Categoría editada satisfactoriamente');
			} catch (error) {
				console.error('Error al editar categoría:', error);
				toast.error('No se pudo editar la categoría');
			}
		}
	};

	const handleDeleteCategoria = async (categoriaId: string) => {
		try {
			await axiosIntance.delete(`${API_URL}/categorias/${categoriaId}`);
			setCategorias(categorias.filter((cat) => cat.id !== categoriaId));
			toast.success('Categoría eliminada satisfactoriamente');
		} catch (error) {
			console.error('Error al eliminar categoría:', error);
			toast.error('No se pudo eliminar la categoría');
		}
	};

	const handleSubcategoriasClick = async (categoria: Categoria) => {
		try {
			const response = await axiosIntance.get(
				`${API_URL}/subcategorias/byCategoria/${categoria.id}`,
			);
			setSubcategorias(response.data);
			setSelectedCategoria(categoria);
			setShowSubcategoriasModal(true);
		} catch (error) {
			console.error('Error al obtener subcategorías:', error);
			toast.error('No se pudo cargar las subcategorías');
		}
	};

	const handleAddSubcategoria = async () => {
		if (selectedCategoria) {
			try {
				const newSub: Subcategoria = {
					nombre: newSubcategoria.nombre,
					categorias: [selectedCategoria],
				};
				const response = await axiosIntance.post(
					`${API_URL}/subcategorias`,
					newSub,
				);
				const subcategoria = response.data;
				setSubcategorias([...subcategorias, subcategoria]);
				setShowAddSubcategoriaModal(false);
				setNewSubcategoria({ nombre: '' });
				toast.success('Subcategoría añadida satisfactoriamente');
			} catch (error) {
				console.error('Error al agregar subcategoría:', error);
				toast.error('No se pudo agregar la subcategoría');
			}
		}
	};

	const handleEditSubcategoria = async () => {
		console.log('subcategoria', editSubcategoria);
		if (editSubcategoria?.idSubcategoria) {
			try {
				const response = await axiosIntance.put(
					`${API_URL}/subcategorias/${editSubcategoria.idSubcategoria}`,
					editSubcategoria,
				);
				const updatedSubcategoria = response.data;
				setSubcategorias(
					subcategorias.map((sub) =>
						sub.idSubcategoria ===
						updatedSubcategoria.idSubcategoria
							? updatedSubcategoria
							: sub,
					),
				);
				setShowEditSubcategoriaModal(false);
				setEditSubcategoria(null);
				toast.success('Subcategoría editada satisfactoriamente');
			} catch (error) {
				console.error('Error al editar subcategoría:', error);
				toast.error('No se pudo editar la subcategoría');
			}
		}
	};

	const handleDeleteSubcategoria = async (subcategoriaId: string) => {
		try {
			await axiosIntance.delete(`${API_URL}/subcategorias/${subcategoriaId}`);
			setSubcategorias(
				subcategorias.filter(
					(sub) => sub.idSubcategoria !== subcategoriaId,
				),
			);
			toast.success('Subcategoría eliminada satisfactoriamente');
		} catch (error) {
			console.error('Error al eliminar subcategoría:', error);
			toast.error('No se pudo eliminar la subcategoría');
		}
	};

	const renderCategoriaActions = (categoria: Categoria) => (
		<div className='flex space-x-2'>
			<Button
				size='sm'
				onClick={() => handleSubcategoriasClick(categoria)}
			>
				Ver Subcategorías
			</Button>
			<Button
				size='sm'
				color='warning'
				onClick={() => {
					setEditCategoria({ ...categoria });
					setShowEditCategoriaModal(true);
				}}
			>
				Editar
			</Button>
			<Button
				size='sm'
				color='danger'
				onClick={() =>
					categoria.id && handleDeleteCategoria(categoria.id)
				}
			>
				Eliminar
			</Button>
		</div>
	);

	const renderSubcategoriaActions = (subcategoria: Subcategoria) => (
		<div className='flex space-x-2'>
			<Button
				size='sm'
				color='warning'
				onClick={() => {
					setEditSubcategoria({ ...subcategoria });
					setShowEditSubcategoriaModal(true);
				}}
			>
				Editar
			</Button>
			<Button
				size='sm'
				color='danger'
				onClick={() =>
					subcategoria.idSubcategoria &&
					handleDeleteSubcategoria(subcategoria.idSubcategoria)
				}
			>
				Eliminar
			</Button>
		</div>
	);

	// Calculate the subcategories to display based on the current page
	const paginatedSubcategorias = subcategorias.slice(
		(page - 1) * rowsPerPage,
		page * rowsPerPage,
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
				<h1 className='text-2xl font-bold mb-4'>Categorías</h1>
				<Button
					color='primary'
					onClick={() => setShowAddCategoriaModal(true)}
				>
					Agregar Categoría
				</Button>
			</div>
			<Table aria-label='Tabla de Categorías' className='mt-4'>
				<TableHeader>
					<TableColumn>Categoría</TableColumn>
					<TableColumn>Acciones</TableColumn>
				</TableHeader>
				<TableBody>
					{categorias.map((categoria) => (
						<TableRow key={categoria.id}>
							<TableCell>{categoria.nombre}</TableCell>
							<TableCell>
								{renderCategoriaActions(categoria)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Modal para agregar categoría */}
			<Modal
				isOpen={showAddCategoriaModal}
				onOpenChange={setShowAddCategoriaModal}
				placement='center'
			>
				<ModalContent>
					<ModalHeader>
						<h2>Agregar Categoría</h2>
					</ModalHeader>
					<ModalBody>
						<Input
							label='Nombre de la Categoría'
							value={newCategoria.nombre}
							onChange={(e) =>
								setNewCategoria({ nombre: e.target.value })
							}
						/>
					</ModalBody>
					<ModalFooter>
						<Button color='primary' onClick={handleAddCategoria}>
							Agregar
						</Button>
						<Button onClick={() => setShowAddCategoriaModal(false)}>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Modal para editar categoría */}
			{editCategoria && (
				<Modal
					isOpen={showEditCategoriaModal}
					onOpenChange={setShowEditCategoriaModal}
					placement='center'
				>
					<ModalContent>
						<ModalHeader>
							<h2>Editar Categoría</h2>
						</ModalHeader>
						<ModalBody>
							<Input
								label='Nombre de la Categoría'
								value={editCategoria.nombre}
								onChange={(e) =>
									setEditCategoria({
										...editCategoria,
										nombre: e.target.value,
									})
								}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color='primary'
								onClick={handleEditCategoria}
							>
								Guardar
							</Button>
							<Button
								onClick={() => setShowEditCategoriaModal(false)}
							>
								Cancelar
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}

			{/* Modal para subcategorías */}
			{selectedCategoria && (
				<Modal
					isOpen={showSubcategoriasModal}
					onOpenChange={setShowSubcategoriasModal}
					placement='center'
				>
					<ModalContent>
						<ModalHeader>
							<h2>Subcategorías de {selectedCategoria.nombre}</h2>
						</ModalHeader>
						<ModalBody>
							<Button
								color='primary'
								onClick={() =>
									setShowAddSubcategoriaModal(true)
								}
							>
								Agregar Subcategoría
							</Button>
							<Table
								aria-label='Tabla de Subcategorías'
								className='mt-4'
							>
								<TableHeader>
									<TableColumn>Subcategoría</TableColumn>
									<TableColumn>Acciones</TableColumn>
								</TableHeader>
								<TableBody>
									{paginatedSubcategorias.map(
										(subcategoria) => (
											<TableRow
												key={
													subcategoria.idSubcategoria
												}
											>
												<TableCell>
													{subcategoria.nombre}
												</TableCell>
												<TableCell>
													{renderSubcategoriaActions(
														subcategoria,
													)}
												</TableCell>
											</TableRow>
										),
									)}
								</TableBody>
							</Table>
							<div className='flex justify-center mt-4'>
								<Pagination
									total={Math.ceil(
										subcategorias.length / rowsPerPage,
									)}
									page={page}
									onChange={(newPage) => setPage(newPage)}
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								onClick={() => setShowSubcategoriasModal(false)}
							>
								Cerrar
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}

			{/* Modal para agregar subcategoría */}
			{selectedCategoria && (
				<Modal
					isOpen={showAddSubcategoriaModal}
					onOpenChange={setShowAddSubcategoriaModal}
					placement='center'
				>
					<ModalContent>
						<ModalHeader>
							<h2>
								Agregar Subcategoría a{' '}
								{selectedCategoria.nombre}
							</h2>
						</ModalHeader>
						<ModalBody>
							<Input
								label='Nombre de la Subcategoría'
								value={newSubcategoria.nombre}
								onChange={(e) =>
									setNewSubcategoria({
										nombre: e.target.value,
									})
								}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color='primary'
								onClick={handleAddSubcategoria}
							>
								Agregar
							</Button>
							<Button
								onClick={() =>
									setShowAddSubcategoriaModal(false)
								}
							>
								Cancelar
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}

			{/* Modal para editar subcategoría */}
			{editSubcategoria && (
				<Modal
					isOpen={showEditSubcategoriaModal}
					onOpenChange={setShowEditSubcategoriaModal}
					placement='center'
				>
					<ModalContent>
						<ModalHeader>
							<h2>Editar Subcategoría</h2>
						</ModalHeader>
						<ModalBody>
							<Input
								label='Nombre de la Subcategoría'
								value={editSubcategoria.nombre}
								onChange={(e) =>
									setEditSubcategoria({
										...editSubcategoria,
										nombre: e.target.value,
									})
								}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color='primary'
								onClick={handleEditSubcategoria}
							>
								Guardar
							</Button>
							<Button
								onClick={() =>
									setShowEditSubcategoriaModal(false)
								}
							>
								Cancelar
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}

			<ToastContainer
				position='top-right'
				autoClose={3000}
				hideProgressBar={false}
			/>
		</div>
	</MainLayout>
	);
};

export default CategoriasPage;
