import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Iniciar sesión',
		},
		{
			name: 'description',
			content: 'Inicia sesión en tu cuenta de BiblioSoft',
		},
	];
};
