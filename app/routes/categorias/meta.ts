import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Categorias | BiblioSoft',
    },
    {
      name: 'description',
      content: 'Gestión de categorias en BiblioSoft',
    },
  ];
};