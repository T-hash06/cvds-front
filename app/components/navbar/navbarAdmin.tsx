import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar,
	NavbarContent,
	NavbarItem,
	User,
} from '@nextui-org/react';
import { LogOut, User as UserLogo } from 'lucide-react';
import type React from 'react';
const NavBarAdmin: React.FC = () => {
	return (
		<Navbar isBordered={true}>
			<NavbarContent justify='end' className='gap-4'>
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

export default NavBarAdmin;
