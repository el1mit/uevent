import { Typography, theme } from 'antd';

const DescriptionText = ({ label, text }) => {
	const { Text } = Typography;

	const {
		token: { colorLink },
	} = theme.useToken();

	return (
		<Text strong>
			{label}: <Text style={{ color: colorLink }}>{text}</Text>
		</Text>
	);
};

export default DescriptionText;
