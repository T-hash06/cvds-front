import {
	Button,
	Chip,
	Input,
	Link,
	Pagination,
	type Selection,
	type SortDescriptor,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/react';

import React from 'react';
import styles from './prestamoTable.modle.css';

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

const PrestamoTable: React.FC = () => {
	// Sample data
	const [loans, _setLoans] = React.useState<Loan[]>([
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

	// State for table management
	const [filterValue, setFilterValue] = React.useState('');
	const [_selectedKeys, setSelectedKeys] = React.useState<Selection>(
		new Set(),
	);
	const [visibleColumns, _setVisibleColumns] = React.useState<Selection>(
		new Set(INITIAL_COLUMNS.map((column) => column.uid)),
	);
	const [rowsPerPage, _setRowsPerPage] = React.useState(5);
	const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
		column: 'id',
		direction: 'ascending',
	});
	const [page, setPage] = React.useState(1);

	// Filtering and sorting logic
	const filteredItems = React.useMemo(() => {
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
	const items = React.useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	// Render cell content
	const renderCell = React.useCallback((loan: Loan, columnKey: React.Key) => {
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
						<Button size='sm' color='primary' variant='light'>
							Editar
						</Button>
						<Button size='sm' color='danger' variant='light'>
							Eliminar
						</Button>
					</div>
				);
			default:
				return loan[columnKey as keyof Loan];
		}
	}, []);

	// Columns rendering
	const headerColumns = React.useMemo(() => {
		return INITIAL_COLUMNS.filter((column) =>
			Array.from(visibleColumns).includes(column.uid),
		);
	}, [visibleColumns]);

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
				<TableBody
					emptyContent={'No hay préstamos para mostrar'}
					items={items}
				>
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
		</div>
	);
};

const PrestamoPage: React.FC = () => {
	return (
		<main className={styles.prestamoPage}>
			<h1 className={styles.title}>Lista de Préstamos</h1>
			<PrestamoTable />
			<Link href='/prestamo' className={styles.prestamoButtonLink}>
				Volver
			</Link>
		</main>
	);
};

export default PrestamoPage;
