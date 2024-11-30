import { useAxios } from '@shared/hooks/axios';

export { meta } from './meta';

const LoginRoute = () => {
	const _axios = useAxios();

	return (
		<div>
			<h1>Login Page</h1>
		</div>
	);
};

export default LoginRoute;
