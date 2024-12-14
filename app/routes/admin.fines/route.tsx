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
import axios from 'axios';
import cookies from 'js-cookie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
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
		new Date(fine.expiredDate).toLocaleDateString(),
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
			{fines ? (
				fines.map((fine) => (
					<TableRow key={fine.fineId}>
						<TableCell>{fine.bookTitle}</TableCell>
						<TableCell>{fine.description}</TableCell>
						<TableCell>{`$${fine.amount}`}</TableCell>
						<TableCell>{fine.fineStatus}</TableCell>
						<TableCell>{fine.fineType}</TableCell>
						<TableCell>
							{new Date(fine.expiredDate).toLocaleDateString()}
						</TableCell>
					</TableRow>
				))
			) : (
				<TableRow>
					<TableCell>No hay multas</TableCell>
					<TableCell>No hay multas</TableCell>
					<TableCell>No hay multas</TableCell>
					<TableCell>No hay multas</TableCell>
					<TableCell>No hay multas</TableCell>
					<TableCell>No hay multas</TableCell>
				</TableRow>
			)}
		</TableBody>
	</Table>
);
const MainContent = () => {
	const [fines, setFines] = React.useState<FineDTO[]>([]);
	const fetchers = React.useRef({
		getFines: async (page: number, size: number) => {
			const token = cookies.get('$$id');
			const response = await axios
				.get(
					`https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/notifications/admin/fines-pending?page=${page}&size=${size}`,
					{
						headers: {
							authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
					},
				)
				.then((response) => {
					return response.data;
				})
				.catch((error) => {
					console.error('Error:', error); // Maneja el error
					return {
						data: [],
						totalItems: 0,
						totalPages: 1,
					};
				});
			return response;
		},
	});
	React.useEffect(() => {
		// Simula carga de datos de API
		const fetchAndSetFines = async () => {
			const fines = await fetchers.current.getFines(0, 10);
			setFines(fines.data);
		};

		fetchAndSetFines();
	}, []);

	const generateReport = () => {
		generatePDF(fines);
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

const AdminFinesRoute = () => {
	const _axios = useAxios();
	return (
		<MainLayout>
			<MainContent />
		</MainLayout>
	);
};
export default AdminFinesRoute;
