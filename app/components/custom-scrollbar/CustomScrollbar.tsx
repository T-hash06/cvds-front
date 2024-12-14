import type { FC, ReactNode } from 'react';
import './CustomScrollbar.css';

interface CustomScrollbarProps {
	children: ReactNode;
	height?: string;
	width?: string;
}

const CustomScrollbar: FC<CustomScrollbarProps> = ({
	children,
	height = '100%',
	width = '100%',
}) => {
	return (
		<div
			className='custom-scrollbar'
			style={{
				height: height,
				width: width,
				overflowY: 'auto',
				overflowX: 'hidden',
			}}
		>
			{children}
		</div>
	);
};

export default CustomScrollbar;
