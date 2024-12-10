import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Notificaciones',
		},
		{
			name: 'description',
			content: 'Notificaciones de tu cuenta de BiblioSoft',
		},
	];
};
