import { useLocation } from 'react-router-dom';
import { useGetEventQuery } from '../features/events/eventsApiSlice';

const useCheckEventAuthor = (eventId) => {
	const location = useLocation();

	const { data: event, isSuccess } = useGetEventQuery(eventId, {
		skip: !eventId,
	});

	if (location.pathname.includes('events') && isSuccess) {
		return { eventAuthorLogin: event.author.login };
	}
	return { eventAuthorLogin: '' };
};

export default useCheckEventAuthor;
