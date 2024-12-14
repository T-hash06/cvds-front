import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Gestión de Estudiantes - Biblioteca Colsabi' },
		{
			name: 'description',
			content:
				'Sistema para agregar estudiantes para la Biblioteca Colsabi',
		},
	];
};
