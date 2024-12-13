import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Consultar Multas',
		},
		{
			name: 'description',
			content: 'Panel consulta de multas',
		},
	];
};
