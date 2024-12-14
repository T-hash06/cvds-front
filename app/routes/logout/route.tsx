import cookies from 'js-cookie';
import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';

const getToken = () => {
	const token = cookies.get('$$id');
	if (!token) {
		return null;
	}
	return token;
};

function Logout() {
	const navigate = useNavigate();

	useEffect(() => {
		const token = getToken();
		if (token) {
			cookies.remove('$$id');
			navigate('/auth/login');
		}
	}, [navigate]);

	return null;
}

export default Logout;