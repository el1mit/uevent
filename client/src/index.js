import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
import './index.css';
import { ConfigProvider, theme } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: '#fa8c16',
						colorBgBase: '#101010',
						colorLink: '#f6952c',
					},
					algorithm: theme.darkAlgorithm,
				}}
			>
				<Routes>
					<Route path="/*" element={<App />} />
				</Routes>
			</ConfigProvider>
		</BrowserRouter>
	</Provider>
);
