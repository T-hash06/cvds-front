import gestionLibros from './assets/standard.png';
import MainLayout from "../../components/layouts/MainLayout";
import { Link } from '@remix-run/react';

const BibliotecaPage = () => {
    return (
        <MainLayout>
            <div className="flex flex-col justify-center items-center">
                <Link to="/books">
                    <div className="border-2 border-white-700 p-2 rounded-lg m-6">
                        <img
                            src={gestionLibros}
                            alt="Gestionar libros"
                            className="max-w-full h-auto"
                            style={{ width: '300px', height: 'auto' }}
                        />
                    </div>
                </Link>

                <div>
                    <h1 className='text-2xl font-semibold text-blue-700'>Gestion de libros</h1>
                </div>
            </div>
        </MainLayout>
    );
};

export default BibliotecaPage;
