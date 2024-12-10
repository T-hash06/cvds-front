import { Button, Card, CardBody } from '@nextui-org/react';
import delIcon from 'app/shared/assets/delete-button.svg';
import playIcon from 'app/shared/assets/play-button.svg';
import type React from 'react';
import './notification.css';
export interface NotificationData {
	type: string;
	bookName: string;
}

interface NotificationProps {
	data: NotificationData;
}
const Notification: React.FC<NotificationProps> = ({ data }) => {
	return (
		<Card className='mt-4 notification'>
			<CardBody className='flex-row justify-center'>
				<p className='text-left w-1/2'>{`${data.type} - ${data.bookName}`}</p>
				{/*<div className="flex">*/}
				<Button size='sm' className='bg-white m-3 ml-4 min-w-2 p-1 h-6'>
					<img src={playIcon} alt='Play' width={24} />
				</Button>
				<Button size='sm' className='bg-white min-w-2 p-1 h-6'>
					<img src={delIcon} alt='Delete' width={24} />
				</Button>
				{/*</div>*/}
				<p className='notification-date'>11-12-1204</p>
			</CardBody>
		</Card>
		/*<div className="notification">
            <p className="info-notification">{data.type + " - " + data.bookName}</p>
            <div className="notification-actions">
                <button><img src="app/routes/notifications/play-button.svg" /></button>
                <button><img src="app/routes/notifications/delete-button.svg"/></button>
                <p className="notification-date">11-12-1204</p>
            </div>
        </div>*/
	);
};

export default Notification;
