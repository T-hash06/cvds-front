import {
	Badge,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar,
	NavbarContent,
	NavbarItem,
	User,
} from '@nextui-org/react';
import { useNavigate } from '@remix-run/react';
import axios from 'axios';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Bell, LogOut, User as UserLogo } from 'lucide-react';
import { useEffect, useState } from 'react';
import type React from 'react';

// DTO Notificaciones navbar
type Notification = {
	id: string;
	notificationType: string;
	bookName: string;
};

interface TokenPayload {
	id: string;
}

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

const NotificationService = async (
	page: number,
	size: number,
): Promise<Notification[]> => {
	const token = cookies.get('$$id');
	const userId = getUserId(token); // Reemplaza por tu lógica para obtener el userId.

	try {
		const response = await axios.get<{ data: Notification[] }>(
			`https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/notifications/users/user/${userId}?page=${page}&size=${size}`,
			{
				headers: {
					authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			},
		);

		// Retorna los datos directamente.
		return response.data.data;
	} catch (error) {
		console.error('Error fetching notifications:', error);
		// Devuelve un array vacío si ocurre un error.
		return [];
	}
};

const NavBarUser: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		const fetchNotifications = async () => {
			const apiNotifications = await NotificationService(0, 10);
			setNotifications([
				...apiNotifications,
				{ id: 'ver-mas', notificationType: 'FINE', bookName: 'sss' },
			]);
		};

		fetchNotifications();
	}, []);

	const navigate = useNavigate();

	const handleNavigation = (route: string) => {
		navigate(route);
	};

	return (
		<Navbar isBordered={true}>
			<NavbarContent justify='end' className='gap-4'>
				<NavbarItem>
					<Dropdown placement='bottom-end'>
						<DropdownTrigger>
							<Button
								isIconOnly={true}
								variant='light'
								className='relative mr-2'
								color='default'
							>
								<Badge color='danger' content='9+' size='sm'>
									<Bell size={20} />
								</Badge>
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							aria-label='Notificaciones'
							variant='flat'
						>
							{notifications.map((notification) =>
								notification.id === 'ver-mas' ? (
									<DropdownItem
										key={notification.id}
										color='primary'
										onPress={() =>
											handleNavigation(
												'/user/notifications',
											)
										}
									>
										{'ver mas'}
									</DropdownItem>
								) : (
									<DropdownItem key={notification.id}>
										{`${notification.bookName} - ${notification.notificationType}`}
									</DropdownItem>
								),
							)}
						</DropdownMenu>
					</Dropdown>
				</NavbarItem>
				<NavbarItem>
					<Dropdown placement='bottom-end'>
						<DropdownTrigger>
							<User
								name='Student Name'
								isFocusable={true}
								description='Student'
								avatarProps={{
									isBordered: true,
									radius: 'lg',
									color: 'primary',
									as: 'button',
									className: 'transition-transform',
									showFallback: true,
									name: 'MU',
									src: '', // En caso de no encontrar la imagen se muestra el name: MU
									size: 'sm',
								}}
							/>
						</DropdownTrigger>
						<DropdownMenu aria-label='Perfil' variant='flat'>
							<DropdownItem
								key='profile'
								// Redireccion usando useNavigate en lugar de Link.
								//onPress={() => handleNavigation('/perfil')}
								startContent={<UserLogo size={20} />}
							>
								Perfil
								{/*<Link to='/perfil'>Perfil</Link>*/}
							</DropdownItem>
							<DropdownItem
								key='logout'
								color='danger'
								startContent={<LogOut size={20} />}
							>
								Cerrar Sesión
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};

export default NavBarUser;
