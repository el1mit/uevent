import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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

import { useRegisterMutation } from './authApiSlice';
import { setCredentials } from './authSlice';
import usePersist from '../../hooks/usePersist';

const Register = () => {
	const [firstname, setFirstName] = useState('');
	const [lastname, setLastName] = useState('');
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [persist, setPersist] = usePersist();
	const [register, { isLoading }] = useRegisterMutation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleFirstnameInput = (e) => setFirstName(e.target.value);
	const handleLastnameInput = (e) => setLastName(e.target.value);
	const handleLoginInput = (e) => setLogin(e.target.value);
	const handlePasswordInput = (e) => setPassword(e.target.value);
	const handleEmailInput = (e) => setEmail(e.target.value);
	const handleCheckbox = (e) => setPersist((prev) => !prev);

	const handleSubmit = async (e) => {
		try {
			console.log({ firstname, lastname, login, password, email });

			const userData = await register({
				firstname,
				lastname,
				login,
				password,
				email,
			}).unwrap();
			dispatch(setCredentials(userData));

			setFirstName('');
			setLastName('');
			setLogin('');
			setPassword('');
			setEmail('');

			navigate('/');
		} catch (error) {
			setErrMsg(error.data.message);
		}
	};

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

				<Typography.Title>Register</Typography.Title>

				<Form align="center" style={{ width: '35vw' }} onFinish={handleSubmit}>
					<Form.Item
						name="firstname"
						label="First Name"
						tooltip="Should be 1 - 12 characters"
						initialValue={firstname}
						rules={[
							{
								required: true,
								message: 'Enter your first name',
							},
							{
								min: 1,
								message: 'Lenth must be at least 1 character',
							},
							{
								max: 12,
								message: 'Lenth must be less than 12 characters',
							},
						]}
					>
						<Input
							type="text"
							value={firstname}
							onChange={handleFirstnameInput}
						/>
					</Form.Item>

					<Form.Item
						name="lastname"
						label="Last Name"
						tooltip="Should be 1 - 12 characters"
						initialValue={lastname}
						rules={[
							{
								required: true,
								message: 'Enter your last name',
							},
							{
								min: 1,
								message: 'Lenth must be at least 1 character',
							},
							{
								max: 12,
								message: 'Lenth must be less than 12 characters',
							},
						]}
					>
						<Input
							type="text"
							value={lastname}
							onChange={handleLastnameInput}
						/>
					</Form.Item>

					<Form.Item
						name="login"
						label="Login"
						tooltip="Should be 6 - 12 characters without spaces"
						initialValue={login}
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
						<Input type="text" value={login} onChange={handleLoginInput} />
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

					<Form.Item
						name="email"
						label="E-mail"
						tooltip="Enter your email to receive account validation link"
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
						<Checkbox checked={persist} onChange={handleCheckbox}>
							Trust this device?
						</Checkbox>
					</Form.Item>

					<Form.Item>
						<Button htmlType="submit" type="primary">
							Register
						</Button>
					</Form.Item>

					<Typography.Title level={5}>
						Already have an account?<Link to="/login"> Login.</Link>
					</Typography.Title>
				</Form>
			</Space>
		);
	}

	return content;
};

export default Register;
