import { Image, Listbox, ListboxItem } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import type { ReactNode } from 'react';

import logo from '@shared/assets/logo.png';

import styles from './Sidebar.module.css';

/**
 * Props for the Sidebar component.
 * @interface SidebarProps
 * @property {Array<{ key: string; label: string; url: string }>} items - Array of menu items for the sidebar.
 */
interface SidebarProps {
	items: { key: string; label: string; url: string }[];
}

/**
 * Props for the Sidebar component.
 * @interface SidebarProps
 * @property {Array<{ key: string; label: string; url: string }>} items - Array of menu items for the sidebar.
 */
interface ListboxWrapperProps {
	children: ReactNode;
}

/**
 * A wrapper for the listbox element.
 * @param {ListboxWrapperProps} props - The props for the ListboxWrapper component.
 * @returns {JSX.Element} The rendered Listbox wrapper.
 */
export const ListboxWrapper = ({ children }: ListboxWrapperProps) => (
	<div className={styles.sidebarList}>{children}</div>
);

/**
 * Sidebar component for displaying a navigational menu.
 *
 * @param {SidebarProps} props - The props for the Sidebar component.
 * @returns {JSX.Element} The rendered Sidebar component.
 */
const Sidebar = ({ items }: SidebarProps) => {
	const title = 'Biblioteca Colsabi';

	const conventionalItems = [
		{
			key: 'inicio',
			label: 'Inicio',
			url: '/',
		},
		...items,
		{
			key: 'soporte',
			label: 'Soporte',
			url: '/',
		},
		{
			key: 'salir',
			label: 'Salir',
			url: '/auth/login',
		},
	];
	return (
		<div className={styles.sidebar}>
			<div className={styles.headerWrapper}>
				<Image
					src={logo}
					alt='Bibliosoft Colsabi'
					className={styles.sidebarLogo}
				/>

				<h1 className={styles.sidebarTitle}>{title}</h1>
			</div>

			<ListboxWrapper>
				<Listbox aria-label='Dynamic Actions' items={conventionalItems}>
					{(item) => (
						<ListboxItem
							key={item.key}
							className={
								item.key === 'salir' ? 'text-danger' : ''
							}
							color={item.key === 'salir' ? 'danger' : 'default'}
							textValue={item.label}
						>
							<Link to={item.url} className={styles.sidebarItem}>
								{item.label}
							</Link>
						</ListboxItem>
					)}
				</Listbox>
			</ListboxWrapper>
		</div>
	);
};

export default Sidebar;
