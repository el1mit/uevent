import { useState } from 'react';
import { Form, Input, Button, Typography, Space, Spin } from 'antd';
import { useResetMutation } from './authApiSlice';

const Reset = () => {
	const [email, setEmail] = useState('');
	const [success, setSuccess] = useState(false);
	const [errMsg, setErrMsg] = useState('');
	const [reset, { isLoading }] = useResetMutation();

	const handleSubmit = async (e) => {
		try {
			await reset({ email }).unwrap();
			setSuccess(true);
		} catch (error) {
			if (!error?.status) {
				setErrMsg('No Server Reasponse');
			} else if (error.status === 400) {
				setErrMsg('Wrong Email');
			} else if (error.status === 401) {
				setErrMsg('Unauthorized');
			} else {
				setErrMsg('Login Failed');
			}
		}
	};

	const handleEmailInput = (e) => setEmail(e.target.value);

	let content;
	if (isLoading) {
		content = <Spin tip="Loading..." size="large" />;
	} else if (success) {
		content = (
			<Typography.Title level={2} align="center">
				Link sent to {email}. Please check your inbox
			</Typography.Title>
		);
	} else {
		content = (
			<Space direction="vertical" align="center" style={{ width: '100%' }}>
				{errMsg && (
					<Typography.Title level={5} type="danger">
						{errMsg}
					</Typography.Title>
				)}

				<Typography.Title>Reset Password</Typography.Title>

				<Form align="center" style={{ width: '35vw' }} onFinish={handleSubmit}>
					<Form.Item
						name="email"
						label="E-mail"
						tooltip="Enter your email to receive link to reset password"
						initialValue={email}
						rules={[
							{
								type: 'email',
								message: 'The input is not valid E-mail!',
							},
							{
								required: true,
								message: 'Please input your E-mail!',
							},
						]}
					>
						<Input value={email} onChange={handleEmailInput} />
					</Form.Item>

					<Form.Item>
						<Button htmlType="submit" type="primary">
							Send Reset Link
						</Button>
					</Form.Item>
				</Form>
			</Space>
		);
	}

	return content;
};

export default Reset;
