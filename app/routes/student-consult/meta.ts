import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [
        { title: 'Consulta de Estudiantes - Biblioteca Colsabi' },
        {
            name: 'description',
            content:
                'Página de consulta para ver la información de los estudiantes.',
        },
    ];
};
