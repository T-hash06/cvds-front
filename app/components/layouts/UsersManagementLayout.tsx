import { Outlet } from '@remix-run/react';
import type { FC, ReactNode } from 'react';
import Navbar from '../navbar/navbarUser';
import UsersManagementSidebar from "../sidebar/UsersManagementSidebar";

interface MainLayoutProps {
    children: ReactNode;
}

const UsersManagementLayout: FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className={'main-layout'}>
            <Navbar />
            <div style={{ display: 'flex' }}>
                <UsersManagementSidebar />
                <main style={{ flex: 1 }}>
                    <Outlet />{' '}
                    {/* Este es el espacio donde se renderizarán las páginas específicas */}
                    {children}
                </main>
            </div>
        </div>
    );
};

export default UsersManagementLayout;
