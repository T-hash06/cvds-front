import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Notificaciones y Multas',
		},
		{
			name: 'description',
			content: 'Panel consulta de Notificaciones y multas',
		},
	];
};
