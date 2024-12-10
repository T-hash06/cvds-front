import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React from 'react';

import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Spacer,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/react';
import { useAxios } from '@shared/hooks/axios';
import NavBarAdmin from 'app/components/navbar/navbarAdmin';
// Fines DTO
interface FineDTO {
	fineId: string;
	description: string;
	amount: number;
	fineStatus: 'PENDING' | 'PAID' | 'FORGIVEN';
	fineType: 'DAMAGE' | 'RETARDMENT';
	expiredDate: Date;
	bookTitle: string;
}
// Table content
interface TableFineProps {
	fines: FineDTO[];
}
/**
 * This function generates a PDF by a given array of FineDTO,
 * implementing the libraries:
 * jspdf
 * jspdf-autotable
 * @param fines The array of FineDTO
 */
const generatePDF = (fines: FineDTO[]) => {
	const doc = new jsPDF();
	doc.setFontSize(16);
	const title = `Reporte de Multas ${new Date().toLocaleDateString()}`;

	doc.text(title, 14, 22);

	const tableData = fines.map((fine) => [
		fine.bookTitle,
		fine.description,
		`$${fine.amount}`,
		fine.fineStatus,
		fine.fineType,
		fine.expiredDate.toLocaleDateString(),
	]);

	autoTable(doc, {
		head: [['Título', 'Descripción', 'Valor', 'Estado', 'Tipo', 'Fecha']],
		body: tableData,
		startY: 30,
		styles: {
			fontSize: 12,
		},
	});

	doc.save('Reporte_Multas.pdf');
};

/**
 * The component TableFines, provides a Table from NextUI.Table
 * by the given parameter of fines (FineDTO).
 * @param param0 the array of fines type FineDTO
 * @returns the NextUI table filled with the fines data.
 */
const TableFines: React.FC<TableFineProps> = ({ fines }) => (
	<Table
		isStriped={true}
		color={'default'}
		selectionMode='single'
		defaultSelectedKeys={['2']}
		aria-label='Example static collection table'
	>
		<TableHeader>
			<TableColumn>TÍTULO DE ARTICULO</TableColumn>
			<TableColumn>DESCRIPCION</TableColumn>
			<TableColumn>VALOR</TableColumn>
			<TableColumn>ESTADO</TableColumn>
			<TableColumn>TIPO DE MULTA</TableColumn>
			<TableColumn>FECHA DE EXPEDICION</TableColumn>
		</TableHeader>

		<TableBody>
			{fines.map((fine) => (
				<TableRow key={fine.fineId}>
					<TableCell>{fine.bookTitle}</TableCell>
					<TableCell>{fine.description}</TableCell>
					<TableCell>{`$${fine.amount}`}</TableCell>
					<TableCell>{fine.fineStatus}</TableCell>
					<TableCell>{fine.fineType}</TableCell>
					<TableCell>
						{fine.expiredDate.toLocaleDateString()}
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);
/**
 * This array represents a Mock of the fines obtained from the API.
 */
const mockFines: FineDTO[] = [
	{
		fineId: 'fine-id-1',
		description: 'Entrego en mal estado',
		amount: 8500,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 11, 25),
		bookTitle: 'Boulevard',
	},
	{
		fineId: 'fine-id-2',
		description: 'Entrego tarde',
		amount: 5000.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 11, 30),
		bookTitle: 'Harry Potter',
	},
	{
		fineId: 'fine-id-3',
		description: 'Entrego tarde',
		amount: 2000.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 12, 1),
		bookTitle: 'El principito',
	},
	{
		fineId: 'fine-id-4',
		description: 'Entrego en mal estado',
		amount: 12000.0,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 12, 5),
		bookTitle: 'Cien años de soledad',
	},
	{
		fineId: 'fine-id-5',
		description: 'Entrego tarde',
		amount: 14500.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 12, 10),
		bookTitle: 'Don Quijote de la Mancha',
	},
	{
		fineId: 'fine-id-6',
		description: 'Entrego en mal estado',
		amount: 15000.0,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 12, 12),
		bookTitle: '1984',
	},
	{
		fineId: 'fine-id-7',
		description: 'Entrego tarde',
		amount: 11000.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 12, 15),
		bookTitle: 'Matar a un ruiseñor',
	},
	{
		fineId: 'fine-id-8',
		description: 'Entrego en mal estado',
		amount: 7000.0,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 12, 20),
		bookTitle: 'Orgullo y prejuicio',
	},
	{
		fineId: 'fine-id-9',
		description: 'Entrego tarde',
		amount: 13000.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 12, 22),
		bookTitle: 'El Gran Gatsby',
	},
	{
		fineId: 'fine-id-10',
		description: 'Entrego en mal estado',
		amount: 9500.0,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 12, 23),
		bookTitle: 'Crimen y castigo',
	},
	{
		fineId: 'fine-id-11',
		description: 'Entrego tarde',
		amount: 10000.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 12, 25),
		bookTitle: 'Cumbres Borrascosas',
	},
	{
		fineId: 'fine-id-12',
		description: 'Entrego en mal estado',
		amount: 7000.0,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 12, 28),
		bookTitle: 'La Odisea',
	},
	{
		fineId: 'fine-id-13',
		description: 'Entrego tarde',
		amount: 11000.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 12, 30),
		bookTitle: 'El señor de los anillos',
	},
	{
		fineId: 'fine-id-14',
		description: 'Entrego en mal estado',
		amount: 8500.0,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 12, 6),
		bookTitle: 'El Hobbit',
	},
	{
		fineId: 'fine-id-15',
		description: 'Entrego tarde',
		amount: 12500.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 12, 8),
		bookTitle: 'Los Miserables',
	},
	{
		fineId: 'fine-id-16',
		description: 'Entrego en mal estado',
		amount: 13500.0,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 12, 10),
		bookTitle: 'Ana Karenina',
	},
	{
		fineId: 'fine-id-17',
		description: 'Entrego tarde',
		amount: 14500.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 12, 12),
		bookTitle: 'Ulises',
	},
	{
		fineId: 'fine-id-18',
		description: 'Entrego en mal estado',
		amount: 10000.0,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 12, 15),
		bookTitle: 'El alquimista',
	},
	{
		fineId: 'fine-id-19',
		description: 'Entrego tarde',
		amount: 8500.0,
		fineStatus: 'PENDING',
		fineType: 'RETARDMENT',
		expiredDate: new Date(2024, 12, 17),
		bookTitle: 'La sombra del viento',
	},
	{
		fineId: 'fine-id-20',
		description: 'Entrego en mal estado',
		amount: 12000.0,
		fineStatus: 'PENDING',
		fineType: 'DAMAGE',
		expiredDate: new Date(2024, 12, 20),
		bookTitle: 'El retrato de Dorian Gray',
	},
];
const MainContent = () => {
	const [fines, setFines] = React.useState<FineDTO[]>([]);

	React.useEffect(() => {
		// Simula carga de datos de API
		setFines(mockFines);
	}, []);

	const generateReport = () => {
		generatePDF(mockFines);
	};
	return (
		<Card className='card-admin-fines'>
			<CardHeader className='flex justify-center items-center p-4'>
				<h4 className='text-xl font-bold'>
					PANEL DE ADMINISTRACION DE MULTAS
				</h4>
			</CardHeader>
			<CardBody className='flex flex-col gap-4'>
				<TableFines fines={fines} />
				<div className='flex justify-left'>
					<Button color='default' onClick={generateReport}>
						Generar Reporte
					</Button>
				</div>
				<Spacer y={2} />
			</CardBody>
		</Card>
	);
};

const Header = () => {
	return (
		<header>
			<NavBarAdmin />
		</header>
	);
};
const AdminFinesRoute = () => {
	const _axios = useAxios();
	return (
		<main>
			<Header />
			<MainContent />
		</main>
	);
};
export default AdminFinesRoute;
