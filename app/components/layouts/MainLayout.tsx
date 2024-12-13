import { Outlet } from '@remix-run/react';
import type { FC, ReactNode } from 'react';
import Navbar from '../navbar/navbarUser';
import Sidebar from '../sidebar/Sidebar';

interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
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
