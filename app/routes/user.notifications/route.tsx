import {
	Card,
	CardBody,
	CardFooter,
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
import { Pagination } from '@nextui-org/react';
import MainLayout from 'app/components/layouts/MainLayout';
import axios from 'axios';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
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
const _notificationsTypes: Record<string, string> = {
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
		className='max-h-96 overflow-y-auto border rounded-md'
	>
		<TableHeader>
			<TableColumn>TÍTULO DE ARTICULO</TableColumn>
			<TableColumn>TIPO</TableColumn>
			<TableColumn>FECHA EXPEDICION</TableColumn>
		</TableHeader>
		<TableBody>
			{notifications ? (
				notifications.map((notification) => (
					<TableRow key={notification.id}>
						<TableCell>{notification.bookName}</TableCell>
						<TableCell>
							{notification.notificationType.replaceAll('_', ' ')}
						</TableCell>
						<TableCell>
							{new Date(
								notification.sentDate,
							).toLocaleDateString()}
						</TableCell>
					</TableRow>
				))
			) : (
				<TableRow>
					<TableCell>No hay notificaciones</TableCell>
					<TableCell>No hay notificaciones</TableCell>
					<TableCell>No hay notificaciones</TableCell>
				</TableRow>
			)}
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
interface TokenPayload {
	id: string;
}
const MainContent = () => {
	const [fines, setFines] = React.useState<FineDTO[]>([]);
	const [notifications, setNotifications] = React.useState<NotificationDTO[]>(
		[],
	);
	const [currentPageFines, setCurrentPageFines] = React.useState(1);
	const [currentPageNotifications, setCurrentPageNotifications] =
		React.useState(1);
	const [totalPagesFines, setTotalPagesFines] = React.useState(1);
	const [totalPagesNotifications, setTotalPagesNotifications] =
		React.useState(1);
	const itemsPerPage = 10;

	const getUserId = (token: string | undefined): string | null => {
		try {
			if (token === undefined) {
				return null;
			}
			// Decodificar el token sin verificar la clave secreta
			const decoded = jwtDecode<TokenPayload>(token);

			// Devuelve el userId si existe
			return decoded?.id || 'no';
		} catch (error) {
			console.error('Error al decodificar el token:', error);
			return 'no';
		}
	};

	const fetchers = React.useRef({
		getNotifications: async (page: number, size: number) => {
			const token = cookies.get('$$id');
			const userId = getUserId(token);
			const response = await axios
				.get(
					`https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/notifications/users/user/${userId}?page=${page}&size=${size}`,
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
		getFines: async (page: number, size: number) => {
			const token = cookies.get('$$id');
			const userId = getUserId(token);
			const response = await axios
				.get(
					`https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/notifications/users/fines/${userId}?page=${page}&size=${size}`,
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

	const fetchFines = React.useCallback(async (page: number) => {
		const fines = await fetchers.current.getFines(page - 1, itemsPerPage);
		setFines(fines.data);
		setTotalPagesFines(fines.totalPages);
	}, []);

	const fetchNotifications = React.useCallback(async (page: number) => {
		const notifications = await fetchers.current.getNotifications(
			page - 1,
			itemsPerPage,
		);
		setNotifications(notifications.data);
		setTotalPagesNotifications(notifications.totalPages);
	}, []);

	React.useEffect(() => {
		fetchFines(currentPageFines); // Llama la función cuando currentPageFines cambia
	}, [currentPageFines, fetchFines]);

	React.useEffect(() => {
		fetchNotifications(currentPageNotifications); // Llama la función cuando currentPageNotifications cambia
	}, [currentPageNotifications, fetchNotifications]);
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
						<CardFooter className='flex flex-col sm:flex-row justify-center items-center gap-4'>
							{/* Paginación para Multas */}
							<Pagination
								total={totalPagesFines}
								page={currentPageFines}
								onChange={setCurrentPageFines}
								color='default'
								className='hidden sm:flex'
								variant='light'
							/>
						</CardFooter>
					</Tab>
					<Tab key='notifications' title='Notificaciones'>
						<TableNotifications notifications={notifications} />

						<CardFooter className='flex flex-col sm:flex-row justify-center items-center gap-4'>
							{/* Paginación para Notificaciones */}
							<Pagination
								total={totalPagesNotifications}
								page={currentPageNotifications}
								onChange={setCurrentPageNotifications}
								color='default'
								className='hidden sm:flex'
								variant='light'
							/>
						</CardFooter>
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
