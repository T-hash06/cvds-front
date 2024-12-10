import { Card } from '@nextui-org/react';
import { useAxios } from '@shared/hooks/axios';
import Notification from '../../components/notifications/Notification';
import '../../components/notifications/notification.css';
import NavBarUser from 'app/components/navbar/navbarUser';
const Header = () => {
	return (
		<header>
			<NavBarUser />
		</header>
	);
};
const NotificationsRoute = () => {
	const _axios = useAxios();
	const data = {
		type: 'Prestamo',
		bookName: 'Cien años de soledad',
	};
	return (
		<div>
			<Header />
			<div className='flex flex-col justify-center items-center'>
				<h1>Notificaciones y Alertas Recientes</h1>
				<Card className='w-[800px] h-[500px] flex-col justify-start items-center'>
					<Notification data={data} />
				</Card>
			</div>
		</div>
	);
};

export default NotificationsRoute;
