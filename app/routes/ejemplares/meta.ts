import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Ejemplares | BiblioSoft',
		},
		{
			name: 'description',
			content: 'Gestión de ejemplares en BiblioSoft',
		},
	];
};
