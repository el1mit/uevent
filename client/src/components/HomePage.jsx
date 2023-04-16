import { Link } from 'react-router-dom';
import { Typography, Button, Space, List, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Event from '../features/events/Event';
import User from '../features/users/User';

import { useGetUsersQuery } from '../features/users/usersApiSlice';
import { useGetEventsQuery } from '../features/events/eventsApiSlice';
import { queryOptions } from '../config/queryOptions';
import useAuth from '../hooks/useAuth';

const HomePage = () => {
	const { Title, Text } = Typography;
	const userParams = { limit: 5, sort: 'new' };
	const eventParams = { limit: 3, sort: 'popular' };
	const { isAuth, login } = useAuth();

	const {
		data: users,
		isLoading: isLoadingUsers,
		isSuccess: isSuccessUsers,
	} = useGetUsersQuery(userParams, queryOptions);

	const {
		data: events,
		isLoading: isLoadingEvents,
		isSuccess: isSuccessEvents,
	} = useGetEventsQuery(eventParams, queryOptions);

	let content;
	if (isLoadingEvents || isLoadingUsers) {
		content = <Spin tip="Loading..." size="large" />;
	} else if (isSuccessEvents || isSuccessUsers) {
		const { ids: eventsIds } = events;
		const { ids: usersIds } = users;

		content = (
			<Space
				direction="vertical"
				size="large"
				style={{
					padding: '30px 30px 0',
				}}
			>
				{/* Welcome text */}
				<Space direction="vertical" style={{ marginBottom: '50px' }}>
					<Title>
						Welcome {isAuth ? 'back' : null} to Step++ Event App
						{isAuth ? `, ${login}` : null}!
					</Title>
					<Title level={4}>
						Discover and join the events. Communicate and Make new friends.
						Enlarge your horizons.
					</Title>

					{/* Auth buttons */}
					{!isAuth ? (
						<Space direction="vertical">
							<Space direction="horizontal">
								<Text>Already have an account? </Text>
								<Link to="/login">
									<Button type="primary">Log in</Button>
								</Link>
							</Space>

							<Space direction="horizontal">
								<Text>New here? </Text>
								<Link to="/register">
									<Button>Sign up</Button>
								</Link>
							</Space>
						</Space>
					) : null}
				</Space>

				{/* List of 3 most popular events */}
				<Space direction="vertical">
					<Space
						direction="horizontal"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<Title level={2}>Popular Events</Title>
						<Link to="/events">
							<Button shape="round" type="primary">
								Browse All Events <ArrowRightOutlined />
							</Button>
						</Link>
					</Space>
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
						dataSource={eventsIds}
						renderItem={(id) => (
							<List.Item>
								<Event key={id} eventId={id} />
							</List.Item>
						)}
					/>
				</Space>

				{/* List of last 5 new users */}
				<Space direction="vertical">
					<Space
						direction="horizontal"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<Title level={2}>New Users</Title>
						<Link to="/users">
							<Button shape="round" type="primary">
								Browse All Users <ArrowRightOutlined />
							</Button>
						</Link>
					</Space>
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
						dataSource={usersIds}
						renderItem={(id) => (
							<List.Item>
								<User key={id} userId={id} />
							</List.Item>
						)}
					/>
				</Space>
			</Space>
		);
	}

	return content;
};

export default HomePage;
