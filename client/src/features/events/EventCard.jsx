import { Link } from 'react-router-dom';
import { Card, Descriptions, Image } from 'antd';
import eventImage from '../../assets/event.png';
import { useGetEventPhotoQuery } from './eventsApiSlice';

const EventCard = ({ event, actions }) => {
	const { error: photoError } = useGetEventPhotoQuery(event.id);

	return (
		<Card
			hoverable
			type="inner"
			cover={
				<Link to={`/events/${event.id}`}>
					<Image
						alt="event"
						preview={false}
						src={
							photoError?.originalStatus === 200
								? `http://localhost:8080/api/events/${event.id}/photo`
								: eventImage
						}
					/>
				</Link>
			}
			actions={actions}
		>
			<Card.Meta
				title={<Link to={`/events/${event.id}`}>{event.name}</Link>}
				description={
					<Descriptions
						size="small"
						column={2}
						labelStyle={{ color: '#b4b4b4' }}
					>
						<Descriptions.Item label="Creator">
							{event.author.login}
						</Descriptions.Item>
						<Descriptions.Item label="Likes">{event.likes}</Descriptions.Item>
						<Descriptions.Item label="Price">
							{event.price ? `${event.price} UAH` : 'Free'}
						</Descriptions.Item>
						<Descriptions.Item label="Category">
							{event.category.name}
						</Descriptions.Item>
						<Descriptions.Item label="Date, Time">
							{new Date(event.time_start).toLocaleString()}
						</Descriptions.Item>
						<Descriptions.Item label="City">
							{event.location.city}, {event.location.country}
						</Descriptions.Item>
					</Descriptions>
				}
			/>
		</Card>
	);
};

export default EventCard;
