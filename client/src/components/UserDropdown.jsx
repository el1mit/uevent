import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Space, Typography, Spin, Button } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import DescriptionText from './DescriptionText';
import NotificationsButton from '../features/notifications/NotificationsButton';

import { useLogoutMutation } from '../features/auth/authApiSlice';
import { useGetWalletQuery } from '../features/wallet/walletApiSlice';

import useAuth from '../hooks/useAuth';
import avatar from '../assets/avatar.png';
import DepositDrawer from '../features/wallet/DepositDrawer';
import WithdrawDrawer from '../features/wallet/WithdrawDrawer';

const UserDropdown = ({ styleProps }) => {
	const { Link: LinkAntd } = Typography;
	const navigate = useNavigate();
	const { login } = useAuth();
	const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
	const [openWithdrawDrawer, setOpenWithdrawDrawer] = useState(false);

	const [logout, { isSuccess: logoutSuccess }] = useLogoutMutation();
	const { data: wallet, isLoading, isSuccess } = useGetWalletQuery();

	useEffect(() => {
		if (logoutSuccess) {
			navigate('/');
		}
	}, [logoutSuccess, navigate]);

	const items = [
		{
			label: <Link to={`/users/${login}`}>My profile</Link>,
			key: '0',
		},
		{
			label: <Link to={`/users/${login}/edit`}>Edit profile</Link>,
			key: '1',
		},
		{
			type: 'divider',
		},
		{
			label: (
				<Typography onClick={() => setOpenDepositDrawer(!openDepositDrawer)}>
					Deposit funds
				</Typography>
			),
			key: '2',
		},
		{
			label: (
				<Typography onClick={() => setOpenWithdrawDrawer(!openWithdrawDrawer)}>
					Withdraw funds
				</Typography>
			),
			key: '3',
		},
		{
			type: 'divider',
		},
		{
			danger: true,
			label: <Typography onClick={logout}>Log out</Typography>,
			key: '4',
		},
	];

	let content;
	if (isLoading) {
		content = <Spin size="medium" />;
	} else if (isSuccess) {
		content = (
			<>
				<DepositDrawer
					open={openDepositDrawer}
					setOpen={setOpenDepositDrawer}
				/>
				<WithdrawDrawer
					open={openWithdrawDrawer}
					setOpen={setOpenWithdrawDrawer}
				/>
				<Space direction="horizontal" size={20} style={styleProps}>
					<Space direction="horizontal">
						<Link to="events/create">
							<Button type="primary" shape="round" icon={<PlusOutlined />}>
								Create Event
							</Button>
						</Link>
						<NotificationsButton />
					</Space>

					<Space direction="horizontal">
						<Avatar
							size="large"
							src={`${process.env.REACT_APP_API_URL}/users/${login}/photo`}
						/>
						<Dropdown
							menu={{
								items,
							}}
							trigger={['click']}
						>
							<LinkAntd onClick={(e) => e.preventDefault()}>
								<Space direction="horizontal">
									<Space direction="vertical">
										<DescriptionText label={'Your login'} text={login} />

										<DescriptionText
											label={'Balance'}
											text={`${wallet.amount} UAH`}
										/>
									</Space>
									<DownOutlined style={{ fontSize: '18px' }} />
								</Space>
							</LinkAntd>
						</Dropdown>
					</Space>
				</Space>
			</>
		);
	}

	return content;
};

export default UserDropdown;
