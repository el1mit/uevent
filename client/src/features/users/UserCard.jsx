import { Link } from 'react-router-dom';
import { Card, Descriptions, Avatar, theme } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

const UserCard = ({ user, actions }) => {
	const {
		token: { colorLink },
	} = theme.useToken();

	return (
		<Card hoverable type="inner" actions={actions}>
			<Card.Meta
				avatar={
					<Avatar
						size="large"
						src={`${process.env.REACT_APP_API_URL}/users/${user.login}/photo`}
					/>
				}
				title={
					<Link to={`/users/${user.login}`}>
						{user.login}{' '}
						{user.official && <CheckCircleTwoTone twoToneColor={colorLink} />}
					</Link>
				}
				description={
					<Descriptions
						size="small"
						column={1}
						labelStyle={{ color: '#b4b4b4' }}
					>
						<Descriptions.Item label="Subscribers">
							{user.subscribers.length}
						</Descriptions.Item>
					</Descriptions>
				}
			/>
		</Card>
	);
};

export default UserCard;
