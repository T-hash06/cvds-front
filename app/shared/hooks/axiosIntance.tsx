import axios from 'axios';
import cookies from 'js-cookie';

const axiosIntance = axios.create({
	baseURL:
		'https://odyv7fszai.execute-api.us-east-1.amazonaws.com/BiblioSoftAPI/',
	withCredentials: true,
});

axiosIntance.interceptors.request.use(
	(config) => {
		const token = cookies.get('$$id');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		config.headers['Content-Type'] = 'application/json';
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default axiosIntance;
