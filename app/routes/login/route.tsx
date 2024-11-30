import { Button, Checkbox, Input } from '@nextui-org/react';
import { useAxios } from '@shared/hooks/axios';

import logo from '@shared/assets/logo.png';
import styles from './login.module.css';

export { meta } from './meta';

const Title = () => {
	return <h1 className={styles.formTitle}>Iniciar Sesión:</h1>;
};

const ForgotPassword = () => {
	return (
		<p className={styles.forgotPasswordText}>
			Olvidaste tu contraseña?{' '}
			<a href='/#' className={styles.forgotPasswordLink}>
				Recupérala aquí
			</a>
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
	return (
		<section className={styles.loginContent}>
			<form className={styles.loginForm}>
				<Title />
				<Input type='text' placeholder='Nombre de usuario' />
				<Input type='password' placeholder='Contraseña' />
				<Checkbox size='sm'>Recordarme</Checkbox>
				<Button color='primary'>Iniciar Sesión</Button>
				<ForgotPassword />
			</form>
		</section>
	);
};

const LoginRoute = () => {
	const _axios = useAxios();

	return (
		<main className={styles.loginPage}>
			<Header />
			<MainContent />
		</main>
	);
};

export default LoginRoute;
