import type { MetaFunction } from '@remix-run/node';

/**
 * Generates meta information for the "Prestamo" route.
 *
 * @returns An array of meta objects containing the title and description for the page.
 */
export const meta: MetaFunction = () => {
	return [
		{
			title: 'Prestamo | Listar',
		},
		{
			name: 'description',
			content: 'Listar préstamos',
		},
	];
};
