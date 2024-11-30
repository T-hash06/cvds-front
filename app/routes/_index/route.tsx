import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Library Search' },
		{ name: 'description', content: 'Welcome to your library search!' },
	];
};

export default function Index() {
	return <h1>CVDS 2024</h1>;
}
