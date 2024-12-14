import { Outlet } from '@remix-run/react';
import { useNavigate } from '@remix-run/react';
import cookies from 'js-cookie';
import type { FC, ReactNode } from 'react';
import CustomScrollbar from '../custom-scrollbar/CustomScrollbar';
import Navbar from '../navbar/navbarUser';
import Sidebar from '../sidebar/Sidebar';

const getToken = () => {
	const token = cookies.get('$$id');
	if (!token) {
		return null;
	}
	return token;
};
interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
	// const navigate = useNavigate();
	// if (!getToken()) {
	// 	navigate('/auth/login');
	// } else {
	// 	navigate('/general');
	// }
	return (
		<div className='main-layout'>
			<Navbar />
			<div style={{ display: 'flex', height: '100vh' }}>
				<Sidebar />
				<main style={{ flex: 1 }}>
					<CustomScrollbar height='100%'>
						<Outlet />
						{children}
					</CustomScrollbar>
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
