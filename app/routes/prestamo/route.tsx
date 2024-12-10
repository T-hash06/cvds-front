export { meta } from './meta';
import { Button } from '@nextui-org/react';
import crearpPrestamo from './assets/crear-prestamo.png';
import devolverPrestamo from './assets/devolver-prestamo.png';
import listarPrestamo from './assets/listar-prestamos.png';
import styles from './prestamo.module.css';

/**
 * Title component renders a heading with a specific style.
 *
 * @returns {JSX.Element} A heading element with the text "¿Qué deseas realizar?".
 */
const Title = () => {
	return <h1 className={styles.title}>¿Qué deseas realizar?</h1>;
};

/**
 * Component for creating a loan (prestamo).
 * 
 * This component renders a card with an image and a title for creating a loan.
 * 
 * @returns {JSX.Element} A JSX element representing the loan creation card.
 */
const CreatePrestamo = () => {
	return (
		<div className={styles.prestamoCard}>
			<img
				src={crearpPrestamo}
				alt='Realizar Préstamo'
				className={styles.prestamoIcon}
			/>
			<h2 className={styles.prestamoCardTitle}>Realizar Préstamo</h2>
		</div>
	);
};

/**
 * Component that renders a card for returning a loan.
 *
 * @component
 * @returns {JSX.Element} A JSX element representing the return loan card.
 *
 * @example
 * // Usage example:
 * <ReturnPrestamo />
 *
 * @remarks
 * This component displays an image and a title indicating the action of returning a loan.
 *
 * @see {@link styles.prestamoCard} for the card styling.
 * @see {@link styles.prestamoIcon} for the icon styling.
 * @see {@link styles.prestamoCardTitle} for the title styling.
 */
const ReturnPrestamo = () => {
	return (
		<div className={styles.prestamoCard}>
			<img
				src={devolverPrestamo}
				alt='Devolver Préstamo'
				className={styles.prestamoIcon}
			/>
			<h2 className={styles.prestamoCardTitle}>Devolver Préstamo</h2>
		</div>
	);
};

/**
 * Component that renders a card for listing loans.
 *
 * @component
 * @example
 * return (
 *   <ListPrestamo />
 * )
 *
 * @returns {JSX.Element} A card component with an image, title, and button for listing loans.
 */
const ListPrestamo = () => {
	return (
		<div className={styles.prestamoCard}>
			<img
				src={listarPrestamo}
				alt='Listar Préstamos'
				className={styles.prestamoIcon}
			/>
			<h2 className={styles.prestamoCardTitle}>Listar Préstamos</h2>
			<Button 
				color='primary'
				radius='full'
				variant='light'
			>
				<a href='/prestamo/listar' className={styles.prestamoButtonLink}>Listar</a>
			</Button>
		</div>
	);
};

/**
 * The `Modules` component renders a container with three sub-components:
 * `CreatePrestamo`, `ReturnPrestamo`, and `ListPrestamo`.
 *
 * @returns A JSX element containing the prestamo modules.
 */
const Modules = () => {
	return (
		<div className={styles.prestamoModules}>
			<CreatePrestamo />
			<ReturnPrestamo />
			<ListPrestamo />
		</div>
	);
};

/**
 * Prestamo component renders the main page for the "prestamo" route.
 * It includes a Title component and a Modules component.
 *
 * @returns {JSX.Element} The JSX code for the Prestamo page.
 */
const Prestamo = () => {
	return (
		<main className={styles.prestamoPage}>
			<Title />
			<Modules />
		</main>
	);
};

export default Prestamo;
