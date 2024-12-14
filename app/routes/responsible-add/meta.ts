import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Gestión de Responsables - Biblioteca Colsabi' },
		{
			name: 'description',
			content:
				'Sistema para agregar responsables para la Biblioteca Colsabi',
		},
	];
};
