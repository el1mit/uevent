import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

import MarkerClusterGroup from 'react-leaflet-cluster';
import EsriLeafletGeoSearch from 'react-esri-leaflet/plugins/EsriLeafletGeoSearch';

import marker from '../assets/marker.png';

const Map = ({
	lat,
	lng,
	setLat,
	setLng,
	setLocation,
	popupText,
	enableSearch = false,
	editCoords = false,
	mapSize = { width: '50vw', height: '50vh' },
}) => {
	const geosearchControlRef = useRef();
	const [latitude, setLatitude] = useState(lat || 50.45);
	const [longitude, setLongitude] = useState(lng || 30.524167);
	const [zoom, setZoom] = useState(15);
	const [popup, setPopup] = useState(popupText || 'Київ, Майдан Незалежності');
	const customIcon = new Icon({
		iconUrl: marker,
		iconAnchor: [18, 38],
		iconSize: [38, 38],
	});

	const handleResults = (results) => {
		setLatitude(results.latlng.lat);
		setLongitude(results.latlng.lng);

		if (editCoords) {
			setLat(results.latlng.lat);
			setLng(results.latlng.lng);
			setLocation((prevState) => ({
				...prevState,
				country: results.results[0].properties.CntryName,
				city: results.results[0].properties.Nbrhd,
				street: results.results[0].properties.StName,
				house_number: results.results[0].properties.AddNum || '1',
			}));
			setPopup(results.text);
		}

		setZoom(18);
		console.log(results);
	};

	return (
		<div>
			<MapContainer
				center={[latitude, longitude]}
				scrollWheelZoom={false}
				zoom={zoom}
				style={mapSize}
			>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

				{/* Search Bar for Places and Addresses */}
				{enableSearch && (
					<EsriLeafletGeoSearch
						ref={geosearchControlRef}
						position="topleft"
						useMapBounds={false}
						placeholder="Search for places or addresses"
						providers={{
							arcgisOnlineProvider: {
								apikey: process.env.REACT_APP_ARCGIS_API_KEY,
							},
							featureLayerProvider: {
								url: 'https://services.arcgis.com/...FeatureServer/0',
								searchFields: ['event_name', 'host_organization'],
								label: 'GIS Day Events 2019',
								bufferRadius: 5000,
								formatSuggestion: function (feature) {
									return (
										feature.properties.event_name +
										' - ' +
										feature.properties.host_organization
									);
								},
							},
						}}
						eventHandlers={{
							// requeststart: () => console.log('Started request...'),
							// requestend: () => console.log('Ended request...'),
							results: handleResults,
						}}
						key={process.env.REACT_APP_ARCGIS_API_KEY}
					/>
				)}

				{/* List of Markers For Map */}
				<MarkerClusterGroup>
					<Marker position={[latitude, longitude]} icon={customIcon}>
						<Popup>{popup}</Popup>
					</Marker>
				</MarkerClusterGroup>
			</MapContainer>
		</div>
	);
};

export default Map;
