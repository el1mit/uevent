import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import usePersist from '../../hooks/usePersist';
import {
	Form,
	Input,
	Button,
	Typography,
	Space,
	Checkbox,
	Spin,
	Alert,
} from 'antd';

import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';

const Login = () => {
	const [userLogin, setUserLogin] = useState('');
	const [password, setPassword] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [persist, setPersist] = usePersist();
	const [login, { isLoading }] = useLoginMutation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		try {
			const userData = await login({ login: userLogin, password }).unwrap();
			dispatch(setCredentials(userData));

			setUserLogin('');
			setPassword('');

			navigate('/');
		} catch (error) {
			setErrMsg(error.data.message);
		}
	};

	const handleUserLoginInput = (e) => setUserLogin(e.target.value);
	const handlePasswordInput = (e) => setPassword(e.target.value);
	const handleCheckbox = (e) => setPersist((prev) => !prev);

	let content;
	if (isLoading) {
		content = <Spin tip="Loading..." size="large" />;
	} else {
		content = (
			<Space direction="vertical" align="center" style={{ width: '100%' }}>
				{errMsg ? (
					<Alert
						style={{ marginBottom: '20px' }}
						message={errMsg}
						type="error"
					/>
				) : null}

				<Typography.Title>Login</Typography.Title>

				<Form align="center" style={{ width: '35vw' }} onFinish={handleSubmit}>
					<Form.Item
						name="login"
						label="Login"
						tooltip="Should be 6 - 12 characters without spaces"
						initialValue={userLogin}
						rules={[
							{
								required: true,
								message: 'Enter your login',
							},
							{
								validator: (_, value) =>
									!value.includes(' ')
										? Promise.resolve()
										: Promise.reject(new Error('No spaces allowed')),
							},
							{
								min: 6,
								message: 'Lenth must be at least 6 characters',
							},
							{
								max: 12,
								message: 'Lenth must be less than 12 characters',
							},
						]}
					>
						<Input type="text" value={login} onChange={handleUserLoginInput} />
					</Form.Item>

					<Form.Item
						name="password"
						label="Password"
						tooltip="Should be 6 - 12 characters without spaces"
						initialValue={password}
						rules={[
							{
								required: true,
								message: 'Enter password',
							},
							{
								validator: (_, value) =>
									!value.includes(' ')
										? Promise.resolve()
										: Promise.reject(new Error('No spaces allowed')),
							},
							{
								min: 6,
								message: 'Lenth must be at least 6 characters',
							},
							{
								max: 12,
								message: 'Lenth must be less than 12 characters',
							},
						]}
					>
						<Input.Password value={password} onChange={handlePasswordInput} />
					</Form.Item>

					<Form.Item>
						<Checkbox checked={persist} onChange={handleCheckbox}>
							Trust this device?
						</Checkbox>
					</Form.Item>

					<Form.Item>
						<Button htmlType="submit" type="primary">
							Login
						</Button>
					</Form.Item>

					<Typography.Title level={5}>
						Don't have an account yet? <Link to="/register">Create.</Link>
					</Typography.Title>

					<Typography.Title level={5}>
						Forget password? <Link to="/reset">Reset.</Link>
					</Typography.Title>
				</Form>
			</Space>
		);
	}

	return content;
};

export default Login;
