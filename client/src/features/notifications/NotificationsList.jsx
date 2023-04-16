import { List } from 'antd';
import NotificationCard from './NotificationCard';

const NotificationsList = ({
	notifications,
	total,
	page,
	setPage,
	limit,
	setLimit,
}) => {
	const handlePageChange = (page, pageSize) => {
		setLimit(pageSize);
		setPage(page - 1);
	};

	return (
		<List
			dataSource={notifications}
			renderItem={(notification) => (
				<List.Item>
					<NotificationCard notification={notification} />
				</List.Item>
			)}
			pagination={{
				position: 'bottom',
				style: { display: 'flex', justifyContent: 'center' },
				total: total,
				current: page + 1,
				pageSize: limit,
				showSizeChanger: true,
				pageSizeOptions: ['5', '10'],
				onChange: handlePageChange,
				showTotal: (total, range) =>
					`${range[0]}-${range[1]} of ${total} items`,
				showQuickJumper: true,
			}}
		/>
	);
};

export default NotificationsList;
