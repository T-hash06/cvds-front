import {
	Button,
	Chip,
	Input,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Pagination,
	Select,
	SelectItem,
	type Selection,
	type SortDescriptor,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/react';
import MainLayout from 'app/components/layouts/MainLayout';
import type React from 'react';
import { useEffect } from 'react';
import { useCallback, useMemo, useState } from 'react';
import styles from './prestamoTable.module.css';

// Define TypeScript interface for Loan
interface Loan {
	id: string;
	idEstudiante: string;
	idLibro: string;
	fechaPrestamo: string;
	fechaDevolucion: string;
	estado: 'Prestado' | 'Devuelto';
	observaciones?: string;
}

// Columns configuration
const INITIAL_COLUMNS = [
	{ name: 'ID', uid: 'id', sortable: true },
	{ name: 'ESTUDIANTE', uid: 'idEstudiante', sortable: true },
	{ name: 'LIBRO', uid: 'idLibro', sortable: true },
	{ name: 'FECHA PRÉSTAMO', uid: 'fechaPrestamo', sortable: true },
	{ name: 'FECHA DEVOLUCIÓN', uid: 'fechaDevolucion', sortable: true },
	{ name: 'ESTADO', uid: 'estado' },
	{ name: 'ACCIONES', uid: 'acciones' },
];

const EditLoanModal: React.FC<{
	loan: Loan | null;
	onClose: () => void;
	onSave: (loan: Loan) => void;
}> = ({ loan, onClose, onSave }) => {
	const [observaciones, setObservaciones] = useState(
		loan?.observaciones || '',
	);
	const [fechaDevolucion, setFechaDevolucion] = useState(
		loan?.fechaDevolucion || '',
	);
	const [estado, setEstado] = useState<'Prestado' | 'Devuelto'>(
		loan?.estado || 'Prestado',
	);

	const handleSave = () => {
		if (loan) {
			onSave({
				...loan,
				observaciones,
				fechaDevolucion,
				estado,
			});
		}
	};

	return (
		<Modal
			isOpen={!!loan}
			onClose={onClose}
			placement='center'
			backdrop='blur'
			size='md'
		>
			<ModalContent>
				<ModalHeader>Editar Préstamo</ModalHeader>
				<ModalBody>
					<Input
						label='Observaciones'
						value={observaciones}
						onChange={(e) => setObservaciones(e.target.value)}
					/>
					<Input
						label='Fecha Devolución'
						type='date'
						value={fechaDevolucion}
						onChange={(e) => setFechaDevolucion(e.target.value)}
					/>
					<Select
						label='Estado'
						value={estado}
						onChange={(e) =>
							setEstado(e.target.value as 'Prestado' | 'Devuelto')
						}
					>
						<SelectItem key='Prestado' value='Prestado'>
							Prestado
						</SelectItem>
						<SelectItem key='Devuelto' value='Devuelto'>
							Devuelto
						</SelectItem>
					</Select>
				</ModalBody>
				<ModalFooter>
					<Button color='danger' variant='light' onPress={onClose}>
						Cancelar
					</Button>
					<Button color='primary' onPress={handleSave}>
						Guardar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

const DeleteLoanModal: React.FC<{
	loan: Loan | null;
	onClose: () => void;
	onDelete: (loan: Loan) => void;
}> = ({ loan, onClose, onDelete }) => {
	const handleDelete = () => {
		if (loan) {
			onDelete(loan);
		}
	};

	return (
		<Modal
			isOpen={!!loan}
			onClose={onClose}
			placement='center'
			backdrop='blur'
			size='md'
		>
			<ModalContent>
				<ModalHeader>Confirmar Eliminación</ModalHeader>
				<ModalBody>
					<p>¿Está seguro que desea eliminar este préstamo?</p>
				</ModalBody>
				<ModalFooter>
					<Button color='danger' variant='light' onPress={onClose}>
						Cancelar
					</Button>
					<Button color='danger' onPress={handleDelete}>
						Eliminar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

const PrestamoTable: React.FC = () => {
	const [loans, setLoans] = useState<Loan[]>([
		{
			id: '674b4a9f8964470f827ade2c',
			idEstudiante: '5f5b3b3b1f1b3b5f5b3b3b1f',
			idLibro: '5f5b3b3b1f1b3b5f5b3b3b1f',
			fechaPrestamo: '2024-11-30',
			fechaDevolucion: '2025-09-18',
			estado: 'Prestado',
		},
		{
			id: '674e1330a3d1fa256a067d08',
			idEstudiante: '5f5b3b3b1f1b3b5f5b3b3b1f',
			idLibro: '5f5b3b3b1f1b3b5f5b3b3b1f',
			fechaPrestamo: '2024-12-02',
			fechaDevolucion: '2025-09-18',
			estado: 'Devuelto',
		},
	]);
	const [filterValue, setFilterValue] = useState('');
	const [_selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
	const [visibleColumns, _setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_COLUMNS.map((column) => column.uid)),
	);
	const [rowsPerPage, _setRowsPerPage] = useState(5);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: 'id',
		direction: 'ascending',
	});
	const [page, setPage] = useState(1);
	const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
	const [isEditModalVisible, setEditModalVisible] = useState(false);
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

	useEffect(() => {
		const fetchLoans = async () => {
			const url =
				'https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/prestamos';
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();
				const filteredData = data.map((loan: Loan) => ({
					id: loan.id,
					idEstudiante: loan.idEstudiante,
					idLibro: loan.idLibro,
					fechaPrestamo: loan.fechaPrestamo,
					fechaDevolucion: loan.fechaDevolucion,
					estado: loan.estado,
				}));
				setLoans(filteredData);
			} catch (error) {
				console.error('Error fetching loans:', error);
			}
		};

		fetchLoans();
	}, []);

	// Filtering and sorting logic
	const filteredItems = useMemo(() => {
		let filtered = [...loans];

		if (filterValue) {
			filtered = filtered.filter((loan) =>
				Object.values(loan).some((value) =>
					value
						.toString()
						.toLowerCase()
						.includes(filterValue.toLowerCase()),
				),
			);
		}

		return filtered.sort((a, b) => {
			const key = sortDescriptor.column as keyof Loan;
			const direction = sortDescriptor.direction === 'ascending' ? 1 : -1;
			const aValue = a[key] ?? '';
			const bValue = b[key] ?? '';
			return aValue.localeCompare(bValue) * direction;
		});
	}, [loans, filterValue, sortDescriptor]);

	// Pagination
	const pages = Math.ceil(filteredItems.length / rowsPerPage);
	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	// Render cell content
	const renderCell = useCallback((loan: Loan, columnKey: React.Key) => {
		switch (columnKey) {
			case 'estado':
				return (
					<Chip
						color={
							loan.estado === 'Devuelto' ? 'success' : 'warning'
						}
						variant='flat'
					>
						{loan.estado}
					</Chip>
				);
			case 'acciones':
				return (
					<div className='flex gap-2'>
						<Button
							size='sm'
							color='primary'
							onPress={() => {
								setSelectedLoan(loan);
								setEditModalVisible(true);
							}}
						>
							Editar
						</Button>
						<Button
							size='sm'
							color='danger'
							onPress={() => {
								setSelectedLoan(loan);
								setDeleteModalVisible(true);
							}}
						>
							Eliminar
						</Button>
					</div>
				);
			default:
				return loan[columnKey as keyof Loan];
		}
	}, []);

	// Columns rendering
	const headerColumns = useMemo(() => {
		return INITIAL_COLUMNS.filter((column) =>
			Array.from(visibleColumns).includes(column.uid),
		);
	}, [visibleColumns]);

	const handleSaveChanges = (updatedLoan: Loan) => {
		const url = `https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/prestamos/update/${updatedLoan.id}`;

		fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedLoan),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				console.log('Success:', data);
				setLoans(
					loans.map((loan) =>
						loan.id === updatedLoan.id ? updatedLoan : loan,
					),
				);
				setEditModalVisible(false);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const handleDeleteLoan = (loanToDelete: Loan) => {
		const url = `https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/prestamos/delete/${loanToDelete.id}`;

		fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				console.log('Success:', data);
				setLoans(loans.filter((loan) => loan.id !== loanToDelete.id));
				setDeleteModalVisible(false);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	return (
		<div className='p-4'>
			<div className='flex justify-between items-center mb-4'>
				<Input
					isClearable={true}
					className='w-full sm:max-w-[44%]'
					placeholder='Buscar préstamo...'
					value={filterValue}
					onClear={() => setFilterValue('')}
					onValueChange={setFilterValue}
				/>
			</div>
			<Table
				aria-label='Tabla de Préstamos'
				isHeaderSticky={true}
				bottomContent={
					<div className='flex w-full justify-center'>
						<Pagination
							isCompact={true}
							showControls={true}
							showShadow={true}
							color='primary'
							page={page}
							total={pages}
							onChange={setPage}
						/>
					</div>
				}
				classNames={{
					wrapper: 'min-h-[340px]',
				}}
				onSortChange={setSortDescriptor}
				onSelectionChange={setSelectedKeys}
			>
				<TableHeader columns={headerColumns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							allowsSorting={column.sortable}
						>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody emptyContent={'No hay préstamos '} items={items}>
					{(item) => (
						<TableRow key={item.id}>
							{(columnKey) => (
								<TableCell>
									{renderCell(item, columnKey)}
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
			{isEditModalVisible && (
				<EditLoanModal
					loan={selectedLoan}
					onClose={() => setEditModalVisible(false)}
					onSave={handleSaveChanges}
				/>
			)}
			{isDeleteModalVisible && (
				<DeleteLoanModal
					loan={selectedLoan}
					onClose={() => setDeleteModalVisible(false)}
					onDelete={handleDeleteLoan}
				/>
			)}
		</div>
	);
};

const PrestamoPage: React.FC = () => {
	return (
		<MainLayout>
			<main className={styles.prestamoPage}>
				<h1 className={styles.title}>Lista de Préstamos</h1>
				<PrestamoTable />
				<Link href='/prestamo' className={styles.prestamoButtonLink}>
					Volver
				</Link>
			</main>
		</MainLayout>
	);
};

export default PrestamoPage;
