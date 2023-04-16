import { useState } from 'react';
import { Button, Badge, Popover, Spin } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import NotificationsList from './NotificationsList';

import { useGetNotificationsQuery } from './notificationsApiSlice';
import { queryOptions } from '../../config/queryOptions';

const NotificationsButton = () => {
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(5);
	const params = { page, limit };

	const { data, isLoading, isSuccess } = useGetNotificationsQuery(
		params,
		queryOptions
	);

	let content;
	if (isLoading) {
		content = <Spin size="small" tip="Loading..." />;
	} else if (isSuccess) {
		const { notifications, total } = data;

		content = (
			<Badge count={notifications.length}>
				<Popover
					placement="bottom"
					overlayClassName={'my-popover'}
					content={
						<NotificationsList
							notifications={notifications}
							total={total}
							page={page}
							setPage={setPage}
							limit={limit}
							setLimit={setLimit}
						/>
					}
					title="Notifications"
					trigger="click"
					open={open}
					onOpenChange={(newOpen) => setOpen(newOpen)}
				>
					<Button type="default" shape="circle" icon={<BellOutlined />} />
				</Popover>
			</Badge>
		);
	}

	return content;
};

export default NotificationsButton;
