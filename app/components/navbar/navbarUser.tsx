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
import { Bell, LogOut, User as UserLogo } from 'lucide-react';
import type React from 'react';
// DTO Notificaciones navbar
type Notification = {
	id: string;
	message: string;
};
const NotificationService = (): Notification[] => {
	// Aquí va la lógica de obtener notificaciones del API
	const mockNotifications: Notification[] = [
		{ id: '1', message: 'Notificación 1' },
		{ id: '2', message: 'Notificación 2' },
		{ id: '3', message: 'Notificación 3' },
		{ id: '4', message: 'Notificación 4' },
		{ id: '5', message: 'Notificación 5' },
		{ id: '6', message: 'Notificación 6' },
		{ id: '7', message: 'Notificación 7' },
		{ id: '8', message: 'Notificación 8' },
		{ id: '9', message: 'Notificación 9' },
	];
	return mockNotifications;
};
const NavBarUser: React.FC = () => {
	const notifications = [
		...NotificationService(),
		{ id: 'ver-mas', message: 'Ver más' },
	];
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
										{notification.message}
									</DropdownItem>
								) : (
									<DropdownItem key={notification.id}>
										{notification.message}
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
