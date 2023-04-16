import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ImgCrop from 'antd-img-crop';
import {
	Form,
	Input,
	Button,
	Typography,
	Space,
	Checkbox,
	Alert,
	Upload,
} from 'antd';

import {
	useGetUserQuery,
	useEditUserMutation,
	useEditUserPhotoMutation,
	useDeleteUserPhotoMutation,
} from '../users/usersApiSlice';

const UserForm = ({ isEditing = false }) => {
	const navigate = useNavigate();
	const { login: userLogin } = useParams();
	const [editUser] = useEditUserMutation();
	const [editUserPhoto] = useEditUserPhotoMutation();
	const [deleteUserPhoto] = useDeleteUserPhotoMutation();

	const [fileList, setFileList] = useState([]);
	const [errMsg, setErrMsg] = useState('');
	const [valuesLoaded, setValuesLoaded] = useState(false);

	const [firstname, setFirstName] = useState('');
	const [lastname, setLastName] = useState('');
	const [login, setLogin] = useState('');
	const [email, setEmail] = useState('');
	const [description, setDescription] = useState('');
	const [official, setOfficial] = useState(false);

	const { data: user, isSuccess: userSuccess } = useGetUserQuery(userLogin);

	useEffect(() => {
		if (isEditing && userSuccess) {
			setFirstName(user.firstname);
			setLastName(user.lastname);
			setLogin(user.login);
			setEmail(user.email);
			setDescription(user.description);
			setOfficial(user.official);
			setValuesLoaded(true);
			setFileList([
				{
					uid: '-1',
					name: 'image.png',
					status: 'done',
					url: `${process.env.REACT_APP_API_URL}/users/${user.login}/photo`,
				},
			]);
		}
	}, [isEditing, user, userSuccess]);

	const submitEdit = async (values) => {
		try {
			const credentials = {
				firstname: values.firstname,
				lastname: values.lastname,
				login: values.login,
				email: values.email,
				official: official,
				description: values.description,
			};

			if (isEditing) {
				await editUser({ userLogin, body: credentials }).unwrap();

				//Decide if we need to upload photo
				if (fileList[0] && fileList[0].uid !== '-1') {
					await editUserPhoto({
						userLogin,
						file: fileList[0].originFileObj,
					});
				} else await deleteUserPhoto(userLogin);

				navigate(`/users/${userLogin}`);
			} else {
				await editUser(credentials).unwrap();
				navigate(`/users/${userLogin}`);
			}
		} catch (error) {
			setErrMsg(error.data.message);
		}
	};

	const changeImage = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	};

	const onPreview = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};

	let content;
	if (valuesLoaded) {
		content = (
			<Space direction="vertical" align="center" style={{ width: '100%' }}>
				{errMsg ? (
					<Alert
						style={{ marginBottom: '20px' }}
						message={errMsg}
						type="error"
					/>
				) : null}

				<Typography.Title>
					{isEditing ? 'Edit Profile' : 'User Creation'}
				</Typography.Title>

				<Form style={{ width: '35vw' }} onFinish={submitEdit}>
					<Form.Item
						label="Change Avatar"
						tooltip="To upload new photo delete the current one, or if you reset to default just delete the current one"
					>
						<ImgCrop
							rotationSlider
							cropShape="round"
							fillColor="black"
							quality={1}
							showReset
							showGrid
						>
							<Upload
								listType="picture-circle"
								fileList={fileList}
								onPreview={onPreview}
								onChange={changeImage}
								beforeUpload={() => false}
								maxCount={1}
							>
								{fileList.length === 0 && '+ Upload'}
							</Upload>
						</ImgCrop>
					</Form.Item>

					<Form.Item
						name="firstname"
						label="First Name"
						tooltip="Should be 1 - 12 characters"
						initialValue={firstname}
						rules={[
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
						<Input type="text" value={firstname} />
					</Form.Item>

					<Form.Item
						name="lastname"
						label="Last Name"
						tooltip="Should be 1 - 12 characters"
						initialValue={lastname}
						rules={[
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
						<Input type="text" value={lastname} />
					</Form.Item>

					<Form.Item
						name="login"
						label="Login"
						tooltip="Should be 6 - 12 characters without spaces"
						initialValue={login}
						rules={[
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
						<Input type="text" value={login} />
					</Form.Item>

					<Form.Item
						name="email"
						label="E-mail"
						initialValue={email}
						rules={[
							{
								type: 'email',
								message: 'The input is not valid E-mail!',
							},
						]}
					>
						<Input value={email} />
					</Form.Item>

					<Form.Item
						name="description"
						label="About"
						tooltip="Write some information about yourself"
						initialValue={description}
					>
						<Input.TextArea rows={3} type="text" value={description} />
					</Form.Item>

					<Form.Item
						name="official"
						valuePropName="checked"
						initialValue={official}
						label="Is your account official?"
					>
						<Checkbox onChange={() => setOfficial(!official)} />
					</Form.Item>

					<Space size="large">
						<Form.Item>
							<Button htmlType="submit" type="primary">
								{isEditing ? 'Edit' : 'Create'}
							</Button>
						</Form.Item>

						<Form.Item>
							<Link to="/users">
								<Button danger type="default">
									Cancel
								</Button>
							</Link>
						</Form.Item>
					</Space>
				</Form>
			</Space>
		);
	}
	return content;
};

export default UserForm;
