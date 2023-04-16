import { useState } from 'react';
import axios from 'axios';
import { Spin, List, Radio, Space, Alert, Switch, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Event from './Event';

import { useGetEventsQuery, useGetEventsIpQuery } from './eventsApiSlice';
import { queryOptions } from '../../config/queryOptions';

const EventsList = () => {
	const [ip, setIp] = useState('');
	const [ipSearch, setIpSearch] = useState(false);

	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(0);
	const [sort, setSort] = useState('earliest');
	const [type, setType] = useState('active');
	const params = { limit, page, sort, type };

	const {
		data: events,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetEventsQuery(params, { ...queryOptions, skip: ipSearch });

	const {
		data: eventsByIp,
		isLoading: isLoadingIp,
		isSuccess: isSuccessIp,
		isError: isErrorIp,
		error: errorIp,
	} = useGetEventsIpQuery({ ip, params }, { ...queryOptions, skip: !ipSearch });

	const handleIpSearch = async () => {
		const res = await axios.get('https://geolocation-db.com/json/');
		setIp(res.data.IPv4);
		setIpSearch(!ipSearch);
	};

	const handlePageChange = (page, pageSize) => {
		setLimit(pageSize);
		setPage(page - 1);
	};

	let list;
	if (isLoading || isLoadingIp) {
		list = <Spin tip="Loading..." size="large" />;
	} else if (isError || isErrorIp) {
		list = (
			<Alert
				style={{ marginBottom: '20px' }}
				message={error?.data?.message || errorIp?.data?.message}
				type="error"
			/>
		);
	} else if (isSuccess || isSuccessIp) {
		const { ids, total } = events || eventsByIp;

		list = (
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 1,
					md: 1,
					lg: 2,
					xl: 2,
					xxl: 3,
				}}
				dataSource={ids}
				renderItem={(id) => (
					<List.Item>
						<Event key={id} eventId={id} />
					</List.Item>
				)}
				pagination={{
					position: 'bottom',
					style: { display: 'flex', justifyContent: 'center' },
					total: total,
					current: page + 1,
					pageSize: limit,
					showSizeChanger: true,
					pageSizeOptions: ['10', '30', '50'],
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
			{/* Filter */}
			<Space direction="horizontal" size={0} align="baseline">
				{/* Filter by date */}
				<Radio.Group
					value={sort}
					onChange={(e) => setSort(e.target.value)}
					buttonStyle="solid"
					style={{ padding: '0 24px 24px' }}
				>
					<Radio.Button value="earliest">Earliest First</Radio.Button>
					<Radio.Button value="latest">Latest First</Radio.Button>
					<Radio.Button value="popular">Popular First</Radio.Button>
				</Radio.Group>

				{/* Filter by type */}
				<Radio.Group
					value={type}
					onChange={(e) => setType(e.target.value)}
					buttonStyle="solid"
					style={{ padding: '0 24px 24px' }}
				>
					<Radio.Button value="active">Active Events</Radio.Button>
					<Radio.Button value="inactive">Inactive Events</Radio.Button>
				</Radio.Group>

				{/* Toggle IP search */}
				<Space direction="horizontal" align="center">
					<Typography.Text style={{ marginRight: 8 }}>
						Events Near You
					</Typography.Text>
					<Switch
						checkedChildren={<CheckOutlined />}
						unCheckedChildren={<CloseOutlined />}
						defaultChecked={ipSearch}
						onChange={handleIpSearch}
					/>
				</Space>
			</Space>

			{/* Events list with pagination*/}
			{list}
		</Space>
	);
};

export default EventsList;
