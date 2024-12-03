import { Button, Checkbox, Input } from '@nextui-org/react';
import { Link, useNavigate } from '@remix-run/react';
import { useAxios } from '@shared/hooks/axios';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import logo from '@shared/assets/logo.png';
import cookies from 'js-cookie';
import React from 'react';

import styles from './login.module.css';

export { meta } from './meta';

interface LoginArgs {
	username: string;
	password: string;
}

const Title = () => {
	return <h1 className={styles.formTitle}>Iniciar Sesión:</h1>;
};

const ForgotPassword = () => {
	return (
		<p className={styles.forgotPasswordText}>
			Olvidaste tu contraseña?{' '}
			<Link to='/login' className={styles.forgotPasswordLink}>
				Recupérala aquí
			</Link>
		</p>
	);
};

const Header = () => {
	return (
		<header className={styles.header}>
			<div className={styles.headerWrapper}>
				<div className={styles.titleWrapper}>
					<img
						src={logo}
						alt='Bibliosoft Colsabi'
						className={styles.headerImage}
					/>
					<h1 className={styles.headerTitle}>Bibliosoft Colsabi</h1>
				</div>
				<div className={styles.headerButtonsContainer}>
					<Button color='default' size='sm' variant='light'>
						Contáctenos
					</Button>
					<Button color='primary' size='sm'>
						Iniciar Sesión
					</Button>
				</div>
			</div>
		</header>
	);
};

const MainContent = () => {
	const axios = useAxios();
	const navigate = useNavigate();

	const fetchers = React.useRef({
		postLogin: async (credentials: LoginArgs) => {
			const response = await axios.post('/auth/login', {
				username: credentials.username,
				password: credentials.password,
			});

			return response.data;
		},
	});

	const [errors, setErrors] = React.useState({
		username: '',
		password: '',
	});

	const loginMutation = useMutation({
		mutationFn: fetchers.current.postLogin,
		onSuccess: (data) => {
			cookies.set('$$id', data);
			navigate('/');
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				const { response } = error;

				if (!response) {
					return;
				}

				setErrors((_prev) => ({
					username: response.data.errors.username || '',
					password: response.data.errors.password || '',
				}));
			}
		},
	});

	const isLoading = loginMutation.isPending;

	const onSubmit = React.useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const formData = new FormData(event.currentTarget);
			const credentials = Object.fromEntries(formData);

			loginMutation.mutate(credentials as unknown as LoginArgs);
		},
		[loginMutation.mutate],
	);

	const clearErrors = React.useCallback(() => {
		setErrors({
			username: '',
			password: '',
		});
	}, []);

	return (
		<section className={styles.loginContent}>
			<form className={styles.loginForm} onSubmit={onSubmit}>
				<Title />
				<Input
					type='text'
					placeholder='Nombre de usuario'
					name='username'
					isDisabled={isLoading}
					errorMessage={errors.username}
					isInvalid={Boolean(errors.username)}
					onValueChange={clearErrors}
				/>
				<Input
					type='password'
					placeholder='Contraseña'
					name='password'
					isDisabled={isLoading}
					errorMessage={errors.password}
					isInvalid={Boolean(errors.password)}
					onValueChange={clearErrors}
				/>
				<Checkbox size='sm'>Recordarme</Checkbox>
				<Button color='primary' type='submit' isLoading={isLoading}>
					Iniciar Sesión
				</Button>
				<ForgotPassword />
			</form>
		</section>
	);
};

const LoginRoute = () => {
	return (
		<main className={styles.loginPage}>
			<Header />
			<MainContent />
		</main>
	);
};

export default LoginRoute;
