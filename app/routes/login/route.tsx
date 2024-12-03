import { Button, Checkbox, Input } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useAxios } from '@shared/hooks/axios';

import logo from '@shared/assets/logo.png';
import cookies from 'js-cookie';
import React from 'react';
import styles from './login.module.css';

export { meta } from './meta';

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

	const onSubmit = React.useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const formData = new FormData(event.currentTarget);
			const credentials = Object.fromEntries(formData);

			const response = await axios.post('/auth/login', credentials);

			cookies.set('$$id', response.data);
		},
		[axios.post],
	);

	return (
		<section className={styles.loginContent}>
			<form className={styles.loginForm} onSubmit={onSubmit}>
				<Title />
				<Input
					type='text'
					placeholder='Nombre de usuario'
					name='username'
				/>
				<Input
					type='password'
					placeholder='Contraseña'
					name='password'
				/>
				<Checkbox size='sm'>Recordarme</Checkbox>
				<Button color='primary' type='submit'>
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
