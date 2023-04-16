import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';

import {
	UserOutlined,
	HomeOutlined,
	CalendarOutlined,
} from '@ant-design/icons';

import { selectMenuState, selectMenuKey } from '../features/menu/menuSlice';

const Sider = () => {
	const { Sider } = Layout;
	const collapsed = useSelector(selectMenuState);
	const menuKey = useSelector(selectMenuKey);

	const navItems = [
		{
			key: '1',
			icon: <HomeOutlined />,
			label: <NavLink to="/">Home</NavLink>,
		},
		{
			key: '2',
			icon: <CalendarOutlined />,
			label: <NavLink to="events">Events</NavLink>,
		},
		{
			key: '3',
			icon: <UserOutlined />,
			label: <NavLink to="/users">Users</NavLink>,
		},
	];

	const {
		token: { colorBgBase },
	} = theme.useToken();

	return (
		<Sider
			trigger={null}
			collapsible
			collapsed={collapsed}
			style={{
				background: colorBgBase,
			}}
		>
			<div className="logo" />

			<Menu
				theme="dark"
				mode="inline"
				selectedKeys={[`${menuKey}`]}
				style={{
					background: colorBgBase,
				}}
				items={navItems}
			/>
		</Sider>
	);
};

export default Sider;
