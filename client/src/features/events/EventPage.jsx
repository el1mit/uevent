import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
	Spin,
	Typography,
	Card,
	Space,
	Button,
	Modal,
	Image,
	theme,
	message,
} from 'antd';

import {
	CheckCircleTwoTone,
	CheckOutlined,
	PlusOutlined,
	HeartOutlined,
	HeartFilled,
	EditOutlined,
	DeleteOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';

import Map from '../../components/Map';
import DescriptionText from '../../components/DescriptionText';
import EventCommentsList from '../comments/EventCommentsList';
import EventSubscribersList from './EventSubscribersList';

import {
	useGetEventQuery,
	useGetEventPhotoQuery,
	useGetEventSubscribersQuery,
	useDeleteEventMutation,
	useEventSubscibeMutation,
	useEventUnsubscibeMutation,
} from './eventsApiSlice';

import {
	useGetLikeQuery,
	useCreateLikeMutation,
	useDeleteLikeMutation,
} from '../likes/likesApiSlice';

import { useGetUserQuery } from '../users/usersApiSlice';

import { queryOptions } from '../../config/queryOptions';
import useAuth from '../../hooks/useAuth';
import eventImage from '../../assets/event.png';

const EventPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { Title } = Typography;
	const { confirm } = Modal;
	const [deleteEvent] = useDeleteEventMutation();
	const [likeEvent] = useCreateLikeMutation();
	const [unlikeEvent] = useDeleteLikeMutation();
	const [eventSubscribe] = useEventSubscibeMutation();
	const [eventUnsubscibe] = useEventUnsubscibeMutation();

	const [subscribed, setSubscribed] = useState(false);
	const [liked, setLiked] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();
	const { login: currentUserLogin, isOwner, isAdmin, isAuth } = useAuth(id);
	const params = { limit: 0 };

	const {
		token: { colorLink },
	} = theme.useToken();

	const { isLoading: isLoadingLike, error: likeError } = useGetLikeQuery(id);

	const {
		data: event,
		isSuccess: eventSuccess,
		isLoading: eventLoading,
	} = useGetEventQuery(id, queryOptions);

	const { error: photoError } = useGetEventPhotoQuery(id);

	const { data: eventSubscribers, isSuccess: eventSubscribersSuccess } =
		useGetEventSubscribersQuery({ eventId: id, params });

	const {
		data: author,
		isSuccess: authorSuccess,
		isLoading: authorLoading,
	} = useGetUserQuery(event?.author?.login, { skip: !event?.author?.login });

	useEffect(() => {
		if (!isLoadingLike && !likeError) {
			setLiked(true);
		}
		if (eventSubscribersSuccess) {
			eventSubscribers.subscribers.forEach((subscriber) => {
				if (subscriber.login === currentUserLogin) {
					setSubscribed(true);
				}
			});
		}
	}, [
		setLiked,
		isLoadingLike,
		likeError,
		eventSubscribersSuccess,
		eventSubscribers,
		currentUserLogin,
	]);

	const handleSubscribe = async () => {
		try {
			if (subscribed) {
				await eventUnsubscibe(id).unwrap();
				setSubscribed(false);
				messageApi.error(`You have unsubscribed from '${event.name}'`);
			} else {
				await eventSubscribe(id).unwrap();
				setSubscribed(true);
				messageApi.success(`You have subscribed to '${event.name}'`);
			}
		} catch (error) {
			messageApi.error(error.data.message);
		}
	};

	const handleLike = async () => {
		try {
			if (liked) {
				await unlikeEvent(id).unwrap();
				setLiked(false);
				messageApi.error(`You have unliked '${event.name}'`);
			} else {
				await likeEvent(id).unwrap();
				setLiked(true);
				messageApi.success(`You have liked '${event.name}'`);
			}
		} catch (error) {
			messageApi.error(error.data.message);
		}
	};

	const showDeleteConfirm = () => {
		confirm({
			title: 'Are you sure you want to delete this event?',
			icon: <ExclamationCircleFilled />,
			content:
				'After you click "Yes", you will not be able to recover this event',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			closable: true,
			async onOk() {
				await deleteEvent(id);
				navigate('/events');
			},
		});
	};

	let content;
	if (eventLoading || authorLoading) {
		content = <Spin tip="Loading..." />;
	} else if (eventSuccess && authorSuccess) {
		content = (
			<Space direction="vertical" style={{ width: '100%' }}>
				{contextHolder}
				<Space align="top" direction="horizontal" style={{ width: '100%' }}>
					<Space direction="vertical" style={{ width: '40vw' }}>
						{/* Event Card with information about it and functionality */}
						<Card type="inner">
							<Space
								align="center"
								direction="vertical"
								style={{ width: '100%', textAlign: 'center' }}
							>
								<Title level={2}>{event.name}</Title>
								<Image
									src={
										photoError?.originalStatus === 200
											? `http://localhost:8080/api/events/${event.id}/photo`
											: eventImage
									}
								/>

								{/* Subscribe and Like Buttons */}
								<Space direction="horizontal">
									<Button
										shape="round"
										onClick={handleSubscribe}
										disabled={isOwner || !event.active || !isAuth}
										type={subscribed ? 'default' : 'primary'}
										icon={subscribed ? <CheckOutlined /> : <PlusOutlined />}
									>
										{subscribed ? 'Subscribed' : 'Subscribe'}
									</Button>

									<Button
										shape="round"
										disabled={!isAuth}
										type={liked ? 'default' : 'primary'}
										icon={liked ? <HeartFilled /> : <HeartOutlined />}
										onClick={handleLike}
									>
										{liked ? 'Liked' : 'Like'}
									</Button>
								</Space>

								<DescriptionText label={'Likes'} text={event.likes} />

								<DescriptionText
									label={'Subscribtion Price'}
									text={event.price ? `${event.price} UAH` : 'Free'}
								/>

								<DescriptionText
									label={'People Limit'}
									text={
										event.people_limit
											? `${event.people_limit} people`
											: 'No limit'
									}
								/>

								<Space direction="horizontal">
									<DescriptionText
										label="Author"
										text={
											<Link to={`/users/${author.login}`}>{author.login}</Link>
										}
									/>
									{author.official && (
										<CheckCircleTwoTone twoToneColor={colorLink} />
									)}
								</Space>

								<DescriptionText
									label={'Category'}
									text={event.category.name}
								/>

								<DescriptionText
									label={'Location'}
									text={`${event?.location?.street} ${event?.location?.house_number}, ${event.location.city}, ${event.location.country}`}
								/>

								<DescriptionText
									label={'Date, Time'}
									text={`${new Date(
										event.time_start
									).toLocaleString()} - ${new Date(
										event.time_end
									).toLocaleString()}`}
								/>

								<Title level={5}>About:</Title>
								<Typography.Text>
									{event.description
										? event.description
										: "Creator didn't provide description for this event"}
								</Typography.Text>

								{/* Admin and Owner can edit and delete and edit event */}
								{isAdmin || isOwner ? (
									<Space align="center" direction="horizontal">
										<Link to={`/events/${event.id}/edit`}>
											<Button
												shape="round"
												type="primary"
												icon={<EditOutlined />}
											>
												Edit Event
											</Button>
										</Link>
										<Button
											shape="round"
											type="default"
											danger
											icon={<DeleteOutlined />}
											onClick={showDeleteConfirm}
										>
											Delete Event
										</Button>
									</Space>
								) : null}
							</Space>
						</Card>

						{/* Event Location on Map */}
						<Map
							lat={event.location.lat}
							lng={event.location.lng}
							popupText={event.name}
							mapSize={{ width: 'inherit', height: '50vh' }}
						/>
					</Space>

					{/*Events Subscribers List*/}
					<Card title="Event Subscribers">
						<EventSubscribersList eventId={id} />
					</Card>
				</Space>

				{/* Event Comments Section */}
				<Card title="Comments">
					<EventCommentsList eventId={id} />
				</Card>
			</Space>
		);
	}

	return content;
};

export default EventPage;
