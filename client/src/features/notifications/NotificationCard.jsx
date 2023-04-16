import { Link } from 'react-router-dom';
import { Card, Button, Space, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const NotificationCard = ({ notification }) => {
	return (
		<Card type="inner" size="small">
			<Space direction="vertical">
				<Space
					direction="horizontal"
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography.Text>
						{new Date(notification.date).toLocaleString()}
					</Typography.Text>
					<Link to={notification.link.replace(process.env.REACT_APP_URL, '')}>
						<Button type="link" shape="round">
							Check it out <ArrowRightOutlined />
						</Button>
					</Link>
				</Space>
				<Typography.Text>{notification.content}</Typography.Text>
			</Space>
		</Card>
	);
};

export default NotificationCard;
