import { useState } from 'react';
import { Space, Radio, Spin, List } from 'antd';
import EventCard from '../events/EventCard';

import { useGetUserEventsQuery } from '../users/usersApiSlice';
import { queryOptions } from '../../config/queryOptions';

const UserCreatedEvents = ({ login }) => {
	const [limit, setLimit] = useState(6);
	const [sort, setSort] = useState('earliest');
	const [page, setPage] = useState(0);
	const [type, setType] = useState('active');

	const params = {
		limit,
		page,
		sort,
		type,
	};

	const { data, isSuccess, isLoading } = useGetUserEventsQuery(
		{
			login,
			params,
		},
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
		const { total, events } = data;

		list = (
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 1,
					md: 1,
					lg: 1,
					xl: 1,
					xxl: 2,
				}}
				dataSource={events}
				renderItem={(event) => (
					<List.Item>
						<EventCard event={event} />
					</List.Item>
				)}
				pagination={{
					position: 'bottom',
					style: { display: 'flex', justifyContent: 'center' },
					total: total,
					current: page + 1,
					pageSize: limit,
					onChange: handlePageChange,
					showSizeChanger: true,
					pageSizeOptions: ['6', '12', '20'],
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} of ${total} items`,
					showQuickJumper: true,
				}}
			/>
		);
	}

	return (
		<Space direction="vertical" size={0} style={{ width: '100%' }}>
			{/* Filter */}
			<Space direction="horizontal" size={0}>
				{/* Filter by date */}
				<Radio.Group
					value={sort}
					onChange={(e) => setSort(e.target.value)}
					buttonStyle="solid"
					style={{ padding: '0 24px 24px' }}
				>
					<Radio.Button value="earliest">Earliest</Radio.Button>
					<Radio.Button value="latest">Latest</Radio.Button>
					<Radio.Button value="popular">Popular</Radio.Button>
				</Radio.Group>

				{/* Filter by type */}
				<Radio.Group
					value={type}
					onChange={(e) => setType(e.target.value)}
					buttonStyle="solid"
					style={{ padding: '0 24px 24px' }}
				>
					<Radio.Button value="active">Active</Radio.Button>
					<Radio.Button value="inactive">Inactive</Radio.Button>
				</Radio.Group>
			</Space>

			{/* Events list with pagination*/}
			{list}
		</Space>
	);
};

export default UserCreatedEvents;
