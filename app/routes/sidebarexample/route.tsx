import { Sidebar } from '@shared/components/sidebar';

export default function App() {
	const items = [
		{
			key: 'historialpres',
			label: 'Historial Préstamos',
			url: '/',
		},
		{
			key: 'historialdevs',
			label: 'Historial Devoluciones',
			url: '/',
		},
		{
			key: 'Gestionar Libros',
			label: 'Edit file',
			url: '/',
		},
		{
			key: 'prueba',
			label: 'Prueba',
			url: '/',
		},
	];

	return <Sidebar items={items} />;
}
