import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ImgCrop from 'antd-img-crop';
import {
	Form,
	Button,
	Typography,
	Space,
	Mentions,
	InputNumber,
	DatePicker,
	Select,
	Alert,
	Upload,
} from 'antd';
import Map from '../../components/Map';

import {
	useGetEventQuery,
	useGetEventPhotoQuery,
	useCreateEventMutation,
	useEditEventMutation,
	useEditEventPhotoMutation,
	useDeleteEventPhotoMutation,
} from './eventsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { useGetCategoriesQuery } from '../categories/categoriesApiSlice';
import eventImage from '../../assets/event.png';

const EventForm = ({ isEditing = false }) => {
	const navigate = useNavigate();
	const { RangePicker } = DatePicker;
	const { id: eventId } = useParams();
	const [createEvent] = useCreateEventMutation();
	const [editEvent] = useEditEventMutation();
	const [editEventPhoto] = useEditEventPhotoMutation();
	const [deleteEventPhoto] = useDeleteEventPhotoMutation();

	const [errMsg, setErrMsg] = useState('');
	const [valuesLoaded, setValuesLoaded] = useState(false);
	const [fileList, setFileList] = useState([]);

	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState();
	const [people_limit, setPeopleLimit] = useState();
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();

	const [lat, setLat] = useState(50.45);
	const [lng, setLng] = useState(30.524167);
	const [location, setLocation] = useState({
		country: 'Ukraine',
		city: 'Kyiv',
		street: 'Maydan Nezalezhnosti',
		house_number: '1',
	});

	let content;

	const { data: event, isSuccess: eventSuccess } = useGetEventQuery(eventId, {
		skip: !isEditing,
	});

	const { error: photoError } = useGetEventPhotoQuery(eventId, {
		skip: !isEditing,
	});

	const {
		data: categories,
		isSuccess: categoriesSuccess,
		isLoading: categoriesLoading,
	} = useGetCategoriesQuery();

	const { data: users, isSuccess: usersSuccess } = useGetUsersQuery({
		limit: 0,
	});

	useEffect(() => {
		if (isEditing && eventSuccess) {
			setName(event.name);
			setCategory(event.category.id);
			setDescription(event.description);
			setPrice(event.price);
			setPeopleLimit(event.people_limit || 0);
			setStartTime(event.time_start);
			setEndTime(event.time_end);

			setLocation((prevState) => ({
				country: event.location.country,
				city: event.location.city,
				street: event.location.street,
				house_number: event.location.house_number,
			}));

			setLat(event.location.lat);
			setLng(event.location.lng);

			setFileList([
				{
					uid: '-1',
					name: 'image.png',
					status: 'done',
					url:
						photoError.originalStatus === 200
							? `${process.env.REACT_APP_API_URL}/events/${event.id}/photo`
							: eventImage,
				},
			]);
		}

		setValuesLoaded(true);
	}, [isEditing, event, eventSuccess, photoError]);
	console.log(event);

	const submitForm = async (values) => {
		try {
			values.time_start = new Date(values.time[0].$d);
			values.time_end = new Date(values.time[1].$d);

			const credentials = {
				name: values.name,
				description: values.description,
				country: location.country,
				city: location.city,
				street: location.street,
				house_number: location.house_number,
				people_limit: values.people_limit,
				category_id: values.category,
				price: values.price,
				time_start: values.time_start.getTime(),
				time_end: values.time_end.getTime(),
			};

			if (isEditing) {
				await editEvent({ id: eventId, body: credentials }).unwrap();

				//Decide if we need to upload photo
				if (fileList[0] && fileList[0].uid !== '-1') {
					await editEventPhoto({
						eventId,
						file: fileList[0].originFileObj,
					});
				} else await deleteEventPhoto(eventId);

				navigate(`/events/${eventId}`);
			} else {
				const event = await createEvent(credentials).unwrap();

				if (fileList[0] && fileList[0].uid !== '-1') {
					await editEventPhoto({
						eventId: event.id,
						file: fileList[0].originFileObj,
					});
				}

				navigate(`/events/${event.id}`);
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

	const mentionOptions = usersSuccess
		? [
				...Object.entries(users.entities).map(([key, value]) => ({
					value: value.login,
					label: value.login,
				})),
		  ]
		: [{ value: '', label: '' }];

	const selectOptions = categoriesSuccess
		? [
				...Object.entries(categories).map(([key, value]) => ({
					value: value.id,
					label: value.name,
				})),
		  ]
		: [{ value: '', label: '' }];

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
					{isEditing ? 'Edit Event' : 'Event Creation'}
				</Typography.Title>

				<Form style={{ width: '40vw' }} onFinish={submitForm}>
					<Form.Item
						label="Event Image"
						tooltip="To upload new photo delete the current one, or if you reset to default just delete the current one"
					>
						<ImgCrop
							rotationSlider
							fillColor="black"
							quality={1}
							showReset
							showGrid
						>
							<Upload
								listType="picture-card"
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
						name="name"
						label="Event name"
						initialValue={name}
						rules={[
							{
								required: true,
								message: 'Enter event name',
							},
						]}
					>
						<Mentions
							rows={1}
							placeholder="You can use @login to ref user here"
							options={mentionOptions}
						/>
					</Form.Item>

					<Form.Item
						name="category"
						label="Choose event category"
						initialValue={category}
						rules={[
							{
								required: true,
								message: 'Chose event category',
							},
						]}
					>
						<Select
							style={{
								width: 120,
							}}
							loading={categoriesLoading}
							options={selectOptions}
						/>
					</Form.Item>

					<Form.Item
						name="description"
						label="Describe your event"
						initialValue={description}
					>
						<Mentions
							rows={3}
							placeholder="You can use @login to ref user here"
							options={mentionOptions}
						/>
					</Form.Item>

					<Form.Item
						name="price"
						label="Set event price"
						initialValue={price}
						rules={[
							{
								required: true,
								message: 'Set price',
							},
						]}
						tooltip="Set 0 if event is free"
					>
						<InputNumber
							disabled={isEditing}
							min={0}
							step={50}
							addonAfter="UAH"
						/>
					</Form.Item>

					<Form.Item
						name="people_limit"
						label="Set limit of people"
						initialValue={people_limit}
						tooltip="Set 0 for no limit"
					>
						<InputNumber min={0} />
					</Form.Item>

					<Form.Item
						name="time"
						label="Set start and end time"
						tooltip="Choose time in future. Event should last at least 30 minutes"
						rules={[
							{
								required: true,
								message:
									'Set start and end time with length of 30 minutes minimum',
							},
						]}
						initialValue={isEditing ? [dayjs(startTime), dayjs(endTime)] : []}
					>
						<RangePicker
							showTime={{
								hideDisabledOptions: true,
							}}
							format="YYYY-MM-DD HH:mm"
						/>
					</Form.Item>

					<Form.Item
						name="location"
						label="Select location"
						style={{ color: 'black' }}
					>
						<Map
							enableSearch={true}
							editCoords={true}
							lat={lat}
							lng={lng}
							setLat={setLat}
							setLng={setLng}
							setLocation={setLocation}
							mapSize={{ width: 'inherit', height: '40vh' }}
						/>
					</Form.Item>

					<Space size="large">
						<Form.Item>
							<Button htmlType="submit" type="primary">
								{isEditing ? 'Edit' : 'Create'}
							</Button>
						</Form.Item>

						<Form.Item>
							<Link to={isEditing ? `/events/${eventId}` : '/events'}>
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

export default EventForm;
