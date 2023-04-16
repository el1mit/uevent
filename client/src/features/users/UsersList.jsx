import { useState } from 'react';
import { Spin, List, Radio, Space, Alert } from 'antd';
import User from './User';
import { useGetUsersQuery } from './usersApiSlice';
import { queryOptions } from '../../config/queryOptions';

const UsersList = () => {
	const [limit, setLimit] = useState(30);
	const [sort, setSort] = useState('new');
	const [page, setPage] = useState(0);
	const params = { limit, sort, page };

	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetUsersQuery(params, queryOptions);

	const handlePageChange = (page, pageSize) => {
		setLimit(pageSize);
		setPage(page - 1);
	};

	let list;
	if (isLoading) {
		list = <Spin tip="Loading..." size="large" />;
	} else if (isError) {
		list = (
			<Alert
				style={{ marginBottom: '20px' }}
				message={error?.data?.message}
				type="error"
			/>
		);
	} else if (isSuccess) {
		const { ids, total } = users;

		list = (
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 1,
					md: 2,
					lg: 3,
					xl: 4,
					xxl: 5,
				}}
				dataSource={ids}
				renderItem={(id) => (
					<List.Item>
						<User key={id} userId={id} />
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
			{/* Filters */}
			<Space direction="horizontal">
				{/* Filter by date */}
				<Radio.Group
					value={sort}
					onChange={(e) => setSort(e.target.value)}
					buttonStyle="solid"
					style={{ padding: '0 24px 24px' }}
				>
					<Radio.Button value="new">New First</Radio.Button>
					<Radio.Button value="old">Old First</Radio.Button>
				</Radio.Group>
			</Space>

			{/* Users list with pagination*/}
			{list}
		</Space>
	);
};

export default UsersList;
