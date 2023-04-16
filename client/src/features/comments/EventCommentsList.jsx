import { useState } from 'react';
import { List, Radio, Spin, Space } from 'antd';
import CommentCard from '../comments/CommentCard';
import CommentForm from './CommentForm';
import { useGetCommentsQuery } from './commentsApiSlice';
import { queryOptions } from '../../config/queryOptions';
import useAuth from '../../hooks/useAuth';

const EventCommentsList = ({ eventId }) => {
	const [limit, setLimit] = useState(10);
	const [sort, setSort] = useState('new');
	const [page, setPage] = useState(0);
	const { isAuth } = useAuth();
	const params = { limit, sort, page };

	const {
		data,
		isLoading: commentsLoading,
		isSuccess: commentsSuccess,
	} = useGetCommentsQuery({ eventId, params }, queryOptions);

	const handlePageChange = (page, pageSize) => {
		setLimit(pageSize);
		setPage(page - 1);
	};

	let list;
	if (commentsLoading) {
		list = <Spin tip="Loading..." />;
	} else if (commentsSuccess) {
		const { comments, total } = data;

		list = (
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 1,
					md: 1,
					lg: 1,
					xl: 1,
					xxl: 1,
				}}
				dataSource={comments}
				renderItem={(comment) => (
					<List.Item>
						<CommentCard comment={comment} />
					</List.Item>
				)}
				pagination={{
					position: 'bottom',
					style: { display: 'flex', justifyContent: 'center' },
					total: total,
					current: page + 1,
					pageSize: limit,
					showSizeChanger: true,
					pageSizeOptions: ['10', '20', '30'],
					onChange: handlePageChange,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} of ${total} items`,
					showQuickJumper: true,
				}}
			/>
		);
	}

	return (
		<Space direction="vertical" style={{ width: '100%' }}>
			{/* Filter */}
			<Space direction="horizontal" size={0}>
				{/* Filter by date */}
				<Radio.Group
					value={sort}
					onChange={(e) => setSort(e.target.value)}
					buttonStyle="solid"
					style={{ padding: '0 24px 24px' }}
				>
					<Radio.Button value="new">New</Radio.Button>
					<Radio.Button value="old">Old</Radio.Button>
				</Radio.Group>
			</Space>

			{/* Events list with pagination*/}
			{list}
			{isAuth && <CommentForm eventId={eventId} />}
		</Space>
	);
};

export default EventCommentsList;
