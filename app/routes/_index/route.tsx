import type { MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import cookies from 'js-cookie';
import { useEffect } from 'react';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Library Search' },
		{ name: 'description', content: 'Welcome to your library search!' },
	];
};

const getToken = () => {
	const token = cookies.get('$$id');
	if (!token) {
		return null;
	}
	return token;
};

export default function Index() {
	const navigate = useNavigate();

	useEffect(() => {
		if (!getToken()) {
			navigate('/auth/login');
		} else {
			navigate('/general');
		}
	}, [navigate]);

	return null;
}
