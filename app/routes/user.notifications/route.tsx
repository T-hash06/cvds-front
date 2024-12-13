import React from 'react';

import {
	Card,
	CardBody,
	CardHeader,
	Spacer,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tabs,
} from '@nextui-org/react';
import MainLayout from 'app/components/layouts/MainLayout';
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
// Notifications DTO
interface NotificationDTO {
	id: string;
	sentDate: Date;
	notificationType:
		| 'ALERT'
		| 'BOOK_LOAN_EXPIRED'
		| 'BOOK_LOAN'
		| 'BOOK_LOAN_RETURNED'
		| 'FINE'
		| 'FINE_PAID';
	bookName: string;
	hasBeenSeen: boolean;
}
function toCamelCase(
	notificationType: keyof typeof notificationsTypes,
): string {
	return notificationType
		.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
		.replace(/^([A-Z])/, (_, letter) => letter.toLowerCase());
}
const notificationsTypes: Record<string, string> = {
	bookloanexpired: 'Préstamo expirado',
	bookloan: 'Préstamo de libro',
	alert: 'Alerta',
	bookloanreturned: 'Libro devuelto',
	finepaid: 'Multa pagada',
	fine: 'Multa',
};
// Table content
interface TableFineProps {
	fines: FineDTO[];
}
interface TableNotificationProps {
	notifications: NotificationDTO[];
}
const TableNotifications: React.FC<TableNotificationProps> = ({
	notifications,
}) => (
	<Table
		isStriped={true}
		color={'default'}
		selectionMode='single'
		defaultSelectedKeys={['2']}
		aria-label='Example static collection table'
	>
		<TableHeader>
			<TableColumn>TÍTULO DE ARTICULO</TableColumn>
			<TableColumn>TIPO</TableColumn>
			<TableColumn>FECHA EXPEDICION</TableColumn>
		</TableHeader>
		<TableBody>
			{notifications.map((notification) => (
				<TableRow key={notification.id}>
					<TableCell>{notification.bookName}</TableCell>
					<TableCell>
						{
							notificationsTypes[
								toCamelCase(notification.notificationType)
							]
						}
					</TableCell>
					<TableCell>
						{notification.sentDate.toLocaleDateString()}
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);

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
const mockNotifications: NotificationDTO[] = [
	{
		id: 'notification-id-1',
		sentDate: new Date(2024, 10, 15),
		notificationType: 'ALERT',
		bookName: 'Cien años de soledad',
		hasBeenSeen: false,
	},
	{
		id: 'notification-id-2',
		sentDate: new Date(2024, 11, 1),
		notificationType: 'BOOK_LOAN_EXPIRED',
		bookName: '1984',
		hasBeenSeen: false,
	},
	{
		id: 'notification-id-3',
		sentDate: new Date(2024, 10, 28),
		notificationType: 'BOOK_LOAN',
		bookName: 'El alquimista',
		hasBeenSeen: true,
	},
	{
		id: 'notification-id-4',
		sentDate: new Date(2024, 11, 5),
		notificationType: 'BOOK_LOAN_RETURNED',
		bookName: 'La sombra del viento',
		hasBeenSeen: true,
	},
	{
		id: 'notification-id-5',
		sentDate: new Date(2024, 11, 3),
		notificationType: 'FINE',
		bookName: 'El principito',
		hasBeenSeen: false,
	},
	{
		id: 'notification-id-6',
		sentDate: new Date(2024, 11, 6),
		notificationType: 'FINE_PAID',
		bookName: 'Harry Potter y la piedra filosofal',
		hasBeenSeen: true,
	},
];
const MainContent = () => {
	const [fines, setFines] = React.useState<FineDTO[]>([]);
	const [notifications, setNotifications] = React.useState<NotificationDTO[]>(
		[],
	);
	React.useEffect(() => {
		// Simula carga de datos de API
		setFines(mockFines);
		setNotifications(mockNotifications);
	}, []);
	return (
		<Card className='card-user-fines'>
			<CardHeader className='flex justify-center items-center p-4'>
				<h4 className='text-xl font-bold'>
					PANEL DE NOTIFICACIONES Y MULTAS
				</h4>
			</CardHeader>
			<CardBody className='flex flex-col gap-4'>
				<Tabs aria-label='Dynamic tabs'>
					<Tab key='fines' title='Multas'>
						<TableFines fines={fines} />
					</Tab>
					<Tab key='notifications' title='Notificaciones'>
						<TableNotifications notifications={notifications} />
					</Tab>
				</Tabs>

				<Spacer y={2} />
			</CardBody>
		</Card>
	);
};

const UserNotificationRoute = () => {
	return (
		<MainLayout>
			<MainContent />
		</MainLayout>
	);
};
export default UserNotificationRoute;
