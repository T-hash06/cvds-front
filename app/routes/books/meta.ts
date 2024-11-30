import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Libros | BiblioSoft',
		},
		{
			name: 'description',
			content: 'Encuentra los libros que necesitas en BiblioSoft',
		},
	];
};
