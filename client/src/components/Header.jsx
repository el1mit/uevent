import { createElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Button, Input, theme, Space, Typography, Image } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { selectMenuState, setCollapsed } from '../features/menu/menuSlice';

import useAuth from '../hooks/useAuth';
import UserDropdown from './UserDropdown';
import logo from '../assets/logo.jpg';

const Header = () => {
	const { Header } = Layout;
	const dispatch = useDispatch();
	const collapsed = useSelector(selectMenuState);
	const { isAuth } = useAuth();

	const {
		token: { colorBgBase },
	} = theme.useToken();

	const handleSearch = (value) => {
		console.log(value);
	};

	return (
		<Header
			style={{
				padding: 0,
				background: colorBgBase,
				display: 'flex',
				flexFlow: 'row nowrap',
				alignItems: 'center',
			}}
		>
			{/* Leftside */}
			<div
				style={{
					display: 'flex',
					flexGrow: '1',
					flexShrink: '2',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'flex-start',
					flexWrap: 'nowrap',
				}}
			>
				{createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
					style: {
						fontSize: '22px',
						paddingLeft: '30px',
					},
					onClick: () => {
						dispatch(setCollapsed(!collapsed));
					},
				})}

				{/* Logo */}
				<Link to="/" style={{ marginLeft: '30px' }}>
					<Space
						direction="horizontal"
						style={{
							display: 'flex',
							alignItems: 'flex-end',
						}}
					>
						<Image
							style={{ borderRadius: '25%' }}
							height={45}
							src={logo}
							preview={false}
						/>
						<Typography.Title strong level={2}>
							Step++
						</Typography.Title>
					</Space>
				</Link>
			</div>

			{/* Center */}
			<div
				style={{
					display: 'flex',
					flexGrow: '2',
					flexShrink: '2',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Input.Search
					placeholder="Input search text"
					allowClear
					enterButton
					onSearch={handleSearch}
					style={{
						flexBasis: '30vw',
					}}
				/>
			</div>

			{/* Rightside */}
			<div
				style={{
					display: 'flex',
					flexGrow: '1',
					flexShrink: '2',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'flex-end',
					gap: '15px',
				}}
			>
				{isAuth ? (
					// Logged in
					<UserDropdown styleProps={{ lineHeight: '0', marginRight: '30px' }} />
				) : (
					// Not logged in
					<Space direction="horizontal" style={{ marginRight: '30px' }}>
						<Link to="/login">
							<Button type="primary">Log in</Button>
						</Link>

						<Link to="/register">
							<Button>Sign up</Button>
						</Link>
					</Space>
				)}
			</div>
		</Header>
	);
};

export default Header;
