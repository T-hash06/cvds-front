import { Outlet } from '@remix-run/react';
import type { FC, ReactNode } from 'react';
import Navbar from '../navbar/navbarUser';
import Sidebar from '../sidebar/Sidebar';
import cookies from 'js-cookie';
import { useNavigate } from '@remix-run/react';

const getToken = () => {
	const token = cookies.get('$$id');
    if (!token) {
		return null;
	} else {
		return token;
	}
};
interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
	const navigate = useNavigate();
	if (!getToken()) {
		navigate('/auth/login');
	} else {
		navigate('/general');
	}
	return (
		<div className={'main-layout'}>
			<Navbar />
			<div style={{ display: 'flex' }}>
				<Sidebar />
				<main style={{ flex: 1 }}>
					<Outlet />{' '}
					{/* Este es el espacio donde se renderizarán las páginas específicas */}
					{children}
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
