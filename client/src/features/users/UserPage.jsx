import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import {
	Spin,
	Avatar,
	Typography,
	Card,
	Space,
	Button,
	Modal,
	theme,
	message,
} from 'antd';

import {
	PlusOutlined,
	CheckOutlined,
	CheckCircleTwoTone,
	EditOutlined,
	DeleteOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';

import DescriptionText from '../../components/DescriptionText';
import UserCreatedEvents from './UserCreatedEvents';
import UserSignedEvents from './UserSignedEvents';

import {
	useGetUserQuery,
	useGetUserSubscribersQuery,
	useGetUserFollowingsQuery,
	useUserSubscibeMutation,
	useUserUnsubscibeMutation,
	useDeleteUserMutation,
} from './usersApiSlice';
import { useLogoutMutation } from '../auth/authApiSlice';

import useAuth from '../../hooks/useAuth';
import { queryOptions } from '../../config/queryOptions';

const UserPage = () => {
	const { login } = useParams();
	const navigate = useNavigate();
	const { Title, Text } = Typography;
	const { confirm } = Modal;
	const [messageApi, contextHolder] = message.useMessage();
	const [userSubscibe] = useUserSubscibeMutation();
	const [userUnsubscibe] = useUserUnsubscibeMutation();
	const [deleteUser] = useDeleteUserMutation();
	const [logout] = useLogoutMutation();

	const [subscribed, setSubscribed] = useState(false);
	const { login: currentUserLogin } = useAuth();
	const { isOwner, isAdmin, isAuth } = useAuth(null, login);

	const {
		token: { colorLink },
	} = theme.useToken();

	const {
		data: user,
		isSuccess: userSuccess,
		isLoading: userLoading,
	} = useGetUserQuery(login, queryOptions);

	const {
		data: subscribers,
		isSuccess: subscribersSuccess,
		isLoading: subscribersLoading,
	} = useGetUserSubscribersQuery(login, queryOptions);

	const {
		data: followings,
		isSuccess: followingsSuccess,
		isLoading: followingsLoading,
	} = useGetUserFollowingsQuery(login, queryOptions);

	useEffect(() => {
		if (subscribersSuccess) {
			subscribers.forEach((subscriber) => {
				if (subscriber.login === currentUserLogin) {
					setSubscribed(true);
				}
			});
		}
	}, [subscribersSuccess, currentUserLogin, subscribers]);

	const showDeleteConfirm = () => {
		confirm({
			title: 'Are you sure you want to delete profile?',
			icon: <ExclamationCircleFilled />,
			content:
				'After you click "Yes", you will not be able to recover this profile',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			closable: true,
			async onOk() {
				deleteUser(login);
				logout();
				navigate('/users');
			},
		});
	};

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

	let content;
	if (userLoading || subscribersLoading || followingsLoading) {
		content = <Spin tip="Loading..." size="large" />;
	} else if (userSuccess && subscribersSuccess && followingsSuccess) {
		content = (
			<Space align="top" direction="horizontal" style={{ width: '100%' }}>
				{contextHolder}
				{/* User Card with information and functionality*/}
				<Card
					type="inner"
					style={{
						minWidth: '30vw',
					}}
				>
					<Space
						align="center"
						direction="vertical"
						style={{ width: '100%', textAlign: 'center' }}
					>
						<Avatar
							size={128}
							src={`${process.env.REACT_APP_API_URL}/users/${login}/photo`}
						/>
						<Title level={2}>
							{user.login}{' '}
							{user.official && <CheckCircleTwoTone twoToneColor={colorLink} />}
						</Title>

						{/* Subscribe Button */}
						<Button
							shape="round"
							disabled={isOwner || !isAuth}
							type={subscribed ? 'default' : 'primary'}
							icon={subscribed ? <CheckOutlined /> : <PlusOutlined />}
							onClick={handleSubscribe}
						>
							{subscribed ? 'Subscribed' : 'Subscribe'}
						</Button>

						<DescriptionText label={'Subscribers'} text={subscribers.length} />
						<DescriptionText label={'Followings'} text={followings.length} />
						<DescriptionText
							label={'Real Name'}
							text={`${user.firstname} ${user.lastname}`}
						/>
						<DescriptionText label={'Email'} text={user.email} />
						<DescriptionText
							label={'Phone Number'}
							text={user.phone_number ? user.phone_number : 'Not given'}
						/>
						<DescriptionText label={'Role'} text={user.role} />
						<Title level={5}>About:</Title>
						<Text>
							{user.description ? user.description : 'No info about this user'}
						</Text>

						{/* Admin and Owner can edit and delete profile */}
						{isAdmin || isOwner ? (
							<Space direction="horizontal">
								<Link to={`/users/${user.login}/edit`}>
									<Button shape="round" type="primary" icon={<EditOutlined />}>
										Edit Profile
									</Button>
								</Link>

								<Button
									danger
									shape="round"
									type="default"
									icon={<DeleteOutlined />}
									onClick={showDeleteConfirm}
								>
									Delete Profile
								</Button>
							</Space>
						) : null}
					</Space>
				</Card>

				<Space direction="vertical" style={{ width: '100%' }}>
					{/* Created Events List */}
					<Card type="inner" title="Created Events" style={{ width: '100%' }}>
						<UserCreatedEvents login={login} />
					</Card>

					{/* Signed Events List */}
					<Card type="inner" title="Signed Events" style={{ width: '100%' }}>
						<UserSignedEvents login={login} />
					</Card>
				</Space>
			</Space>
		);
	}

	return content;
};

export default UserPage;
