import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout as AntdLayout, theme } from 'antd';
import Header from './Header';
import Sider from './Sider';

import { setMenuKey } from '../features/menu/menuSlice';

const Layout = () => {
	const { Content } = AntdLayout;
	const dispatch = useDispatch();
	const location = useLocation();

	if (location.pathname.includes('users')) {
		dispatch(setMenuKey(3));
	} else if (location.pathname.includes('events')) {
		dispatch(setMenuKey(2));
	} else {
		dispatch(setMenuKey(1));
	}

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	return (
		<AntdLayout
			style={{
				minHeight: '100vh',
			}}
		>
			<Header />

			<AntdLayout>
				<Sider />
				<Content
					style={{
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
						width: '100%',
					}}
				>
					<Outlet />
				</Content>
			</AntdLayout>
		</AntdLayout>
	);
};

export default Layout;
