import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Subcategorias | BiblioSoft',
    },
    {
      name: 'description',
      content: 'Gestión de subcategorias en BiblioSoft',
    },
  ];
};