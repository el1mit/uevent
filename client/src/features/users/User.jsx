import { useEffect, useState, memo } from 'react';
import { Button, message, Spin } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import {
	useGetUsersQuery,
	useUserSubscibeMutation,
	useUserUnsubscibeMutation,
} from './usersApiSlice';
import UserCard from './UserCard';

const User = ({ userId }) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [userSubscibe] = useUserSubscibeMutation();
	const [userUnsubscibe] = useUserUnsubscibeMutation();
	const [subscribed, setSubscribed] = useState(false);
	const { id: currentUserId, isAuth } = useAuth();

	const { user } = useGetUsersQuery('usersList', {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId],
		}),
	});

	useEffect(() => {
		setSubscribed(user?.subscribers?.includes(currentUserId));
	}, [user, currentUserId]);

	const handleSubscribe = async () => {
		if (subscribed) {
			await userUnsubscibe({ login: user.login, id: user.id });
			setSubscribed(false);
			messageApi.error(`You have unsubscribed from ${user.login}`);
		} else {
			await userSubscibe({ login: user.login, id: user.id });
			setSubscribed(true);
			messageApi.success(`You have subscribed to ${user.login}`);
		}
	};

	const actions = [
		<Button
			size="small"
			shape="round"
			disabled={userId === currentUserId || !isAuth}
			type={subscribed ? 'default' : 'primary'}
			icon={subscribed ? <CheckOutlined /> : <PlusOutlined />}
			onClick={handleSubscribe}
		>
			{subscribed ? 'Subscribed' : 'Subscribe'}
		</Button>,
	];

	let content;
	if (user) {
		content = (
			<>
				<UserCard user={user} actions={actions} />
				{contextHolder}
			</>
		);
	} else {
		content = <Spin tip="Loading..." />;
	}

	return content;
};

const memoizedUser = memo(User);

export default memoizedUser;
