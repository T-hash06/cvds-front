import { useNavigate } from '@remix-run/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/react';

const API_URL = 'http://localhost:8080';

interface Categoria {
	idCategoria?: string;
	nombre: string;
}

interface Subcategoria {
	idSubcategoria?: string;
	nombre: string;
	categorias?: Categoria[];
}

const SubcategoriasPage = () => {
	const navigate = useNavigate();

	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [selectedCategoria, setSelectedCategoria] =
		useState<Categoria | null>(null);
	const [newCategoria, setNewCategoria] = useState<Categoria>({ nombre: '' });
	const [showAddCategoriaModal, setShowAddCategoriaModal] = useState(false);
	const [showSubcategoriasModal, setShowSubcategoriasModal] = useState(false);
	const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
	const [newSubcategoria, setNewSubcategoria] = useState<Subcategoria>({
		nombre: '',
	});
	const [showAddSubcategoriaModal, setShowAddSubcategoriaModal] =
		useState(false);

	useEffect(() => {
		fetchCategorias();
	}, []);

	const fetchCategorias = async () => {
		try {
			const response = await axios.get(`${API_URL}/categorias`);
			setCategorias(response.data);
			toast.success('Categorías cargadas satisfactoriamente');
		} catch (error) {
			console.error('Error al obtener categorías:', error);
			toast.error('No se pudo cargar las categorías');
		}
	};

	const handleAddCategoria = async () => {
		try {
			const response = await axios.post(
				`${API_URL}/categorias`,
				newCategoria,
			);
			const categoria = response.data;
			// Add default subcategoria 'default' and associate with the new categoria
			await axios.post(`${API_URL}/subcategorias`, {
				nombre: 'default',
				categorias: [categoria],
			});
			setCategorias([...categorias, categoria]);
			setShowAddCategoriaModal(false);
			setNewCategoria({ nombre: '' });
			toast.success("Categoría añadida con subcategoría 'default'");
		} catch (error) {
			console.error('Error al añadir la categoría:', error);
			toast.error('No se pudo añadir la categoría');
		}
	};

	const handleSubcategoriasClick = async (categoria: Categoria) => {
		try {
			const response = await axios.get(
				`${API_URL}/subcategorias/byCategoria/${categoria.idCategoria}`,
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
				const response = await axios.post(`${API_URL}/subcategorias`, {
					nombre: newSubcategoria.nombre,
					categorias: [selectedCategoria],
				});
				setSubcategorias([...subcategorias, response.data]);
				setShowAddSubcategoriaModal(false);
				setNewSubcategoria({ nombre: '' });
				toast.success('Subcategoría añadida satisfactoriamente');
			} catch (error) {
				console.error('Error al añadir la subcategoría:', error);
				toast.error('No se pudo añadir la subcategoría');
			}
		}
	};

	const renderCategoriaActions = (categoria: Categoria) => (
		<div className='flex space-x-2'>
			<Button
				size='sm'
				onClick={() => handleSubcategoriasClick(categoria)}
			>
				Subcategorias
			</Button>
			<Button
				size='sm'
				onClick={() => {
					/* Edit categoria */
				}}
			>
				Editar
			</Button>
			<Button
				size='sm'
				onClick={() => {
					/* Delete categoria */
				}}
			>
				Eliminar
			</Button>
		</div>
	);

	const renderSubcategoriaActions = () => (
		<div className='flex space-x-2'>
			<Button
				size='sm'
				onClick={() => {
					/* Edit subcategoria */
				}}
			>
				Editar
			</Button>
			<Button
				size='sm'
				onClick={() => {
					/* Delete subcategoria */
				}}
			>
				Eliminar
			</Button>
		</div>
	);

	return (
		<div className='p-6 bg-blue-50 min-h-screen'>
			<div className='flex items-center justify-between mb-6'>
				<Button onClick={() => navigate('/books')}>
					← Volver a Libros
				</Button>
				<h1 className='text-3xl font-bold text-blue-700'>
					Gestión de Categorías y Subcategorías
				</h1>
				<Button onClick={() => setShowAddCategoriaModal(true)}>
					Añadir Categoría
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableColumn>Nombre</TableColumn>
					<TableColumn>Acciones</TableColumn>
				</TableHeader>
				<TableBody>
					{categorias.map((categoria) => (
						<TableRow key={categoria.idCategoria}>
							<TableCell>{categoria.nombre}</TableCell>
							<TableCell>
								{renderCategoriaActions(categoria)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Add Categoria Modal */}
			<Modal
				isOpen={showAddCategoriaModal}
				onOpenChange={setShowAddCategoriaModal}
			>
				<ModalContent>
					<ModalHeader>
						<h2>Añadir Nueva Categoría</h2>
					</ModalHeader>
					<ModalBody>
						<Input
							label='Nombre'
							value={newCategoria.nombre}
							onChange={(e) =>
								setNewCategoria({ nombre: e.target.value })
							}
						/>
					</ModalBody>
					<ModalFooter>
						<Button onClick={handleAddCategoria}>Confirmar</Button>
						<Button onClick={() => setShowAddCategoriaModal(false)}>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Subcategorias Modal */}
			{selectedCategoria && (
				<Modal
					isOpen={showSubcategoriasModal}
					onOpenChange={setShowSubcategoriasModal}
				>
					<ModalContent>
						<ModalHeader>
							<div className='flex justify-between'>
								<h2>
									Subcategorías de {selectedCategoria.nombre}
								</h2>
								<Button
									size='sm'
									onClick={() =>
										setShowAddSubcategoriaModal(true)
									}
								>
									Añadir Subcategoría
								</Button>
							</div>
						</ModalHeader>
						<ModalBody>
							<Table>
								<TableHeader>
									<TableColumn>Nombre</TableColumn>
									<TableColumn>Acciones</TableColumn>
								</TableHeader>
								<TableBody>
									{subcategorias.map((subcategoria) => (
										<TableRow
											key={subcategoria.idSubcategoria}
										>
											<TableCell>
												{subcategoria.nombre}
											</TableCell>
											<TableCell>
												{renderSubcategoriaActions()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
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

			{/* Add Subcategoria Modal */}
			<Modal
				isOpen={showAddSubcategoriaModal}
				onOpenChange={setShowAddSubcategoriaModal}
			>
				<ModalContent>
					<ModalHeader>
						<h2>
							Añadir Subcategoría a {selectedCategoria?.nombre}
						</h2>
					</ModalHeader>
					<ModalBody>
						<Input
							label='Nombre'
							value={newSubcategoria.nombre}
							onChange={(e) =>
								setNewSubcategoria({ nombre: e.target.value })
							}
						/>
					</ModalBody>
					<ModalFooter>
						<Button onClick={handleAddSubcategoria}>
							Confirmar
						</Button>
						<Button
							onClick={() => setShowAddSubcategoriaModal(false)}
						>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<ToastContainer
				position='top-right'
				autoClose={3000}
				hideProgressBar={true}
			/>
		</div>
	);
};

export default SubcategoriasPage;
