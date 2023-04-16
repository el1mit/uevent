import { useEffect, useState, memo } from 'react';

import { Button, message, Spin } from 'antd';

import {
	PlusOutlined,
	CheckOutlined,
	HeartOutlined,
	HeartFilled,
} from '@ant-design/icons';

import EventCard from './EventCard';

import {
	useGetEventsQuery,
	useEventSubscibeMutation,
	useEventUnsubscibeMutation,
} from './eventsApiSlice';

import {
	useGetLikeQuery,
	useCreateLikeMutation,
	useDeleteLikeMutation,
} from '../likes/likesApiSlice';

import { useGetUserEventsSignedQuery } from '../users/usersApiSlice';

import useAuth from '../../hooks/useAuth';

const Event = ({ eventId }) => {
	const [liked, setLiked] = useState(false);
	const [subscribed, setSubscribed] = useState(false);
	const [likeEvent] = useCreateLikeMutation();
	const [unlikeEvent] = useDeleteLikeMutation();
	const [eventSubscribe] = useEventSubscibeMutation();
	const [eventUnsubscibe] = useEventUnsubscibeMutation();

	const [messageApi, contextHolder] = message.useMessage();
	const { login: currentUserLogin, isAuth, isOwner } = useAuth(eventId);
	const params = { limit: 0 };

	const { event } = useGetEventsQuery('eventsList', {
		selectFromResult: ({ data }) => ({
			event: data?.entities[eventId],
		}),
	});

	const { data: signedEvents, isSuccess: signedEventsSuccess } =
		useGetUserEventsSignedQuery({
			login: currentUserLogin,
			params,
		});

	const { isLoading: isLoadingLike, error: likeError } =
		useGetLikeQuery(eventId);

	useEffect(() => {
		if (!isLoadingLike && !likeError) {
			setLiked(true);
		}
	}, [setLiked, isLoadingLike, likeError]);

	useEffect(() => {
		if (signedEventsSuccess) {
			signedEvents.events.forEach((event) => {
				if (event.id === eventId) {
					setSubscribed(true);
				}
			});
		}
	}, [signedEventsSuccess, signedEvents, eventId]);

	const handleLike = async () => {
		try {
			if (liked) {
				await unlikeEvent(eventId).unwrap();
				setLiked(false);
				messageApi.error(`You have unliked '${event.name}'`);
			} else {
				await likeEvent(eventId).unwrap();
				setLiked(true);
				messageApi.success(`You have liked '${event.name}'`);
			}
		} catch (error) {
			messageApi.error(error.data.message);
		}
	};

	const handleSubscribe = async () => {
		try {
			if (subscribed) {
				await eventUnsubscibe(eventId).unwrap();
				setSubscribed(false);
				messageApi.error(`You have unsubscribed from '${event.name}'`);
			} else {
				await eventSubscribe(eventId).unwrap();
				setSubscribed(true);
				messageApi.success(`You have subscribed to '${event.name}'`);
			}
		} catch (error) {
			messageApi.error(error.data.message);
		}
	};

	// Event Actions
	const actions = [
		<Button
			size="small"
			shape="round"
			onClick={handleSubscribe}
			disabled={isOwner || !event?.active || !isAuth}
			type={subscribed ? 'default' : 'primary'}
			icon={subscribed ? <CheckOutlined /> : <PlusOutlined />}
		>
			{subscribed ? 'Subscribed' : 'Subscribe'}
		</Button>,
		<Button
			size="small"
			shape="round"
			onClick={handleLike}
			disabled={!isAuth}
			type={liked ? 'default' : 'primary'}
			icon={liked ? <HeartFilled /> : <HeartOutlined />}
		>
			{liked ? 'Liked' : 'Like'}
		</Button>,
	];

	let content;
	if (event && !isLoadingLike) {
		content = (
			<>
				<EventCard event={event} actions={actions} />
				{contextHolder}
			</>
		);
	} else {
		content = <Spin tip="Loading..." />;
	}

	return content;
};

const memoizedEventCard = memo(Event);

export default memoizedEventCard;
