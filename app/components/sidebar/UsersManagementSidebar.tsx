import { Link } from '@remix-run/react';
import { useState } from 'react';
import { CiMenuBurger, CiMenuFries } from 'react-icons/ci';

const sectionsByRole: Record<string, { name: string; path: string }[]> = {
    admin: [
        { name: 'Inicio', path: '/admin/home' },
        { name: 'Adicionar Estudiante', path: '/students-add' },
        { name: 'Adicionar Responsable', path: '/responsible-add' },
        { name: 'Adicionar Curso', path: '/course/add' },
        { name: 'Consultar Estudiante', path: '/student-consult' },
        { name: 'Consultar Responsable', path: '/responsible-consult' },
        { name: 'Soporte', path: '/admin/support' },
        { name: 'Salir', path: '/logout' },
    ],
    user: [
        { name: 'Mi Biblioteca', path: '/user/library' },
        { name: 'Historial Préstamos', path: '/user/history' },
        { name: 'Perfil', path: '/user/profile' },
        { name: 'Soporte', path: '/user/support' },
        { name: 'Salir', path: '/logout' },
    ],
};

const UsersManagementSidebar = () => {
    const [isVisible, setIsVisible] = useState(true);

    const toggleSidebar = () => {
        setIsVisible(!isVisible);
    };

    const userRole = 'admin'; // Se debe obtener dinámicamente
    const sections = sectionsByRole[userRole] || [];

    return (
        <aside
            className={`flex flex-col bg-gray-100 h-screen transition-all duration-300 ease-in-out ${
                isVisible ? 'w-64' : 'w-20'
            }`}
        >
            {/* Logo */}
            <div className='flex justify-center items-center py-4'>
                <img
                    src='/app/shared/assets/logo.png' // Cambia por la ruta real de tu logo
                    alt='Logo Biblioteca Colsabi'
                    className='w-16 h-16'
                />
            </div>

            {/* Título */}
            {isVisible && (
                <h1 className='text-xl font-bold text-center text-gray-800'>
                    Biblioteca Colsabi
                </h1>
            )}

            {/* Botón para alternar el sidebar */}
            <button
                type='button'
                onClick={toggleSidebar}
                className='bg-transparent border-none cursor-pointer p-4'
            >
                {isVisible ? (
                    <CiMenuFries size={30} />
                ) : (
                    <CiMenuBurger size={30} />
                )}
            </button>

            {/* Navegación */}
            {isVisible && (
                <nav className='flex flex-col mt-6'>
                    <ul className='space-y-4'>
                        {sections.map((section) => (
                            <li key={section.path}>
                                <Link
                                    to={section.path}
                                    className='block text-gray-800 text-base no-underline hover:text-blue-600 px-4'
                                >
                                    {section.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </aside>
    );
};

export default UsersManagementSidebar;
