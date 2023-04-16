import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';

import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Reset from './features/auth/Reset';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import Prefetch from './features/auth/Prefetch';

import UsersList from './features/users/UsersList';
import UserPage from './features/users/UserPage';
import UserForm from './features/users/UserForm';

import EventsList from './features/events/EventsList';
import EventPage from './features/events/EventPage';
import EventForm from './features/events/EventForm';

import { ROLES } from './config/roles';

const App = () => {
	return (
		<Routes>
			<Route element={<PersistLogin />}>
				<Route path="/" element={<Layout />}>
					{/* Public Routes*/}
					<Route element={<Prefetch />}>
						<Route index element={<HomePage />} />
						<Route path="users" element={<UsersList />} />
						<Route path="users/:login" element={<UserPage />} />
						<Route path="events" element={<EventsList />} />
						<Route path="events/:id" element={<EventPage />} />
						<Route path="login" element={<Login />} />
						<Route path="register" element={<Register />} />
						<Route path="reset" element={<Reset />} />
						<Route path="*" element={<NotFound />} />

						{/* Private Routes */}
						<Route
							element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
						>
							<Route path="events/create" element={<EventForm />} />

							{/*Only Owner And Admins Can Edit Users Profiles*/}
							<Route
								element={
									<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Owner]} />
								}
							>
								<Route
									path="users/:login/edit"
									element={<UserForm isEditing={true} />}
								/>
							</Route>

							{/*Only Owner And Admins Can Edit Events*/}
							<Route
								element={
									<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Owner]} />
								}
							>
								<Route
									path="events/:id/edit"
									element={<EventForm isEditing={true} />}
								/>
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>
		</Routes>
	);
};

export default App;
