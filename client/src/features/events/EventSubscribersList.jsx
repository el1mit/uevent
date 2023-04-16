import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Spin, List, Space, Card, Avatar, Descriptions, theme } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { useGetEventSubscribersQuery } from './eventsApiSlice';
import { queryOptions } from '../../config/queryOptions';

import avatar from '../../assets/avatar.png';

const EventSubscribersList = ({ eventId }) => {
	const [limit, setLimit] = useState(15);
	const [page, setPage] = useState(0);
	const params = { limit, page };

	const {
		token: { colorLink },
	} = theme.useToken();

	const { data, isLoading, isSuccess } = useGetEventSubscribersQuery(
		{ params, eventId },
		queryOptions
	);

	const handlePageChange = (page, pageSize) => {
		setLimit(pageSize);
		setPage(page - 1);
	};

	let list;
	if (isLoading) {
		list = <Spin tip="Loading..." />;
	} else if (isSuccess) {
		const { subscribers, total } = data;

		list = (
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 1,
					md: 1,
					lg: 1,
					xl: 1,
					xxl: 3,
				}}
				dataSource={subscribers}
				renderItem={(subscriber) => (
					<List.Item>
						<Card hoverable type="inner">
							<Card.Meta
								avatar={<Avatar size="large" src={avatar} />}
								title={
									<Link to={`/users/${subscriber.login}`}>
										{subscriber.login}{' '}
										{subscriber.official && (
											<CheckCircleTwoTone twoToneColor={colorLink} />
										)}
									</Link>
								}
								description={
									<Descriptions
										size="small"
										column={1}
										labelStyle={{ color: '#b4b4b4' }}
									>
										<Descriptions.Item>
											{subscriber.firstname} {subscriber.lastname}
										</Descriptions.Item>
									</Descriptions>
								}
							/>
						</Card>
					</List.Item>
				)}
				pagination={{
					position: 'bottom',
					style: { display: 'flex', justifyContent: 'center' },
					total: total,
					current: page + 1,
					pageSize: limit,
					showSizeChanger: true,
					pageSizeOptions: ['15', '32'],
					onChange: handlePageChange,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} of ${total} items`,
					showQuickJumper: true,
				}}
			/>
		);
	}

	return (
		<Space direction="vertical" size={0} style={{ width: '100%' }}>
			{/* Subscribers list with pagination*/}
			{list}
		</Space>
	);
};

export default EventSubscribersList;
