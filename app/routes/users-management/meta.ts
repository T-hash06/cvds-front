import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Gestión de Estudiantes y Responsables - Biblioteca Colsabi' },
		{
			name: 'description',
			content:
				'Sistema de gestión de estudiantes y responsables para la Biblioteca Colsabi',
		},
	];
};
