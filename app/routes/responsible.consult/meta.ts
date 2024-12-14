import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [
        { title: 'Consulta de Responsables - Biblioteca Colsabi' },
        {
            name: 'description',
            content:
                'Página para consultar la información de los responsables registrados en el sistema de gestión de la Biblioteca Colsabi.',
        },
    ];
};
