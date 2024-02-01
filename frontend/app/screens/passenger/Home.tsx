import React, {useEffect, useState} from 'react';
import MapView, {Marker, Polyline, PROVIDER_DEFAULT, Region} from "react-native-maps";
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from '../../../constants/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationService from '../../../services/LocationService';
import TripService from '../../../services/TripService';
import {useSession} from "../../../auth/AuthContext";


export default function HomePage() {

	const [location, setLocation] = useState<Location.LocationObject | null>(null);
	const [destination, setDestination] = useState({latitude: 0, longitude: 0});
	const [errorMsg, setErrorMsg] = useState<String | null>(null);
	const [routeCoordinates, setRouteCoordinates] = useState<Array<any>>([]);
	const [driverCoordinates, setDriverCoordinates] = useState<Array<any>>([]);
	const [currRegion, setCurrentRegion] = useState<Region | null>(null);
	const [startTrip, setStartTrip] = useState(false);
	const [trip, setTrip] = useState(false);
	const [tripId, setTripId] = useState(0);
	const [driverLocation, setDriverLocation] = useState({latitude: 0, longitude: 0});
	const [loading, setLoading] = useState(false);
	const mapRef = React.useRef<MapView>(null);

	const getRouteCoordinates = (origin: any, destination: any) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?access_token=pk.eyJ1IjoiMHg0bnMiLCJhIjoiY2xvNjNjYXI0MDFwdTJsbXN4Y3NrcHgxOCJ9.FD6viYFpWMcdE8FJkrqUZw&geometries=geojson`;
        console.log('Route url: ', url);
        return fetch(url)
            .then((res) => res.json())
    }

	const handlePress = (e: any) => {
		if (startTrip) {
			setDestination(e.nativeEvent.coordinate);
			getRouteCoordinates(location?.coords, e.nativeEvent.coordinate)
            .then((res) => {
                //console.log('Route: ', res.routes[0].geometry.coordinates);
                console.log('Route: ', res);
                setRouteCoordinates(res.routes[0].geometry.coordinates.map((coordinate: any) => {
					return {
						latitude: coordinate[1],
						longitude: coordinate[0]
					}
				}));
                //console.log('Coordinates: ', coordinates);
            })
		}
	}

	const handleStartTrip = () => {
		setStartTrip(true);
		console.log('Current region: ', currRegion);
	}

	const handleCancelTrip = () => {
		setStartTrip(false);
		setDestination({latitude: 0, longitude: 0});
	}

	const initTrip = () => {
		const sourceLocation = {pickupLatitude: location?.coords.latitude, pickupLongitude: location?.coords.longitude};
		const destinationLocation = {distinationLatitude: destination.latitude, distinationLongitude: destination.longitude};
		TripService.createTrip(sourceLocation.pickupLatitude, sourceLocation.pickupLongitude, destinationLocation.distinationLatitude, destinationLocation.distinationLongitude)
		.then((trip) => {

			console.log('Trip created: ', trip);
			setLoading(true);
			setStartTrip(false);
			setTripId(trip.id);
			let interval = setInterval(() => {
				
				TripService.tripInProgress()
				.then(({trip,userLocation}) => {
					console.log('Trip in progress: ', trip);
					if(trip?.status == 'ACCEPTED'){	
						console.log('Driver location: ', userLocation);
						setTrip(true);
						setDriverLocation({latitude: userLocation.latitude, longitude: userLocation.longitude});
						
						if(driverCoordinates.length == 0){
							getRouteCoordinates(location?.coords, userLocation)
							.then((res) => {
								console.log('Driver Route: ', res);
								setDriverCoordinates(res.routes[0].geometry.coordinates.map((coordinate: any) => {
									return {
										latitude: coordinate[1],
										longitude: coordinate[0]
									}
								}));
							});
						}
						
						setLoading(false);
					}
				})
				.catch((error) => {
					console.error(error);
					setLoading(false);
					clearInterval(interval);
					setRouteCoordinates([]);
					setDriverCoordinates([]);
					setDriverLocation({latitude: 0, longitude: 0});
					setDestination({latitude: 0, longitude: 0});
				});
			}, 8000);
	
			mapRef.current?.animateToRegion({
				latitude: location?.coords.latitude || 37.78825,
				longitude: location?.coords.longitude || -122.4324,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}, 1000);

		})
		.catch((error) => {
			console.error(error);
		});


	}
	
	const handleConfirmTrip = () => {
		Alert.alert(
			"Confirm destination",
			"Are you sure you want to choose this destination ?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				},
				{
					text: "OK", onPress: initTrip
				}
			]
		);
	}

	const handleFinishTrip = () => {
		Alert.alert(
			"Finish trip",
			"Are you sure you want to finish the trip ?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				},
				{
					text: "OK", onPress: () => {
						TripService.finishTrip(tripId)
						.then(() => {
							setTrip(false);
							setDestination({latitude: 0, longitude: 0});
							setDriverLocation({latitude: 0, longitude: 0});

							mapRef.current?.animateToRegion({
								latitude: location?.coords.latitude || 37.78825,
								longitude: location?.coords.longitude || -122.4324,
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421,
							}, 1000);
						})
						.catch((error) => {
							console.error(error);
						});
					}
				}
			]
		);
	}

	const {accessToken} = useSession();
	/**Api functions */
	const sendLocation = () => {
		setInterval(() => {
			if (location) {
				LocationService.sendLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
			}
		}, 15000);
	}

	sendLocation()

	useEffect(() => {
		(async () => {
			let {status} = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			setInterval(async () => {
				let location = await Location.getCurrentPositionAsync({});
				setLocation(location);
			}, 6000);
		})();

	}, []);

	return (
		<View style={styles.container}>
			<MapView
				ref={mapRef}
				zoomControlEnabled={true}
				scrollEnabled={true}
				scrollDuringRotateOrZoomEnabled={false}
				style={StyleSheet.absoluteFill}
				provider={PROVIDER_DEFAULT}
				showsMyLocationButton={true}
				showsUserLocation={true}
				showsCompass={true}
				showsScale={true}
				onRegionChange={(region) => {
					setCurrentRegion(region);
				}}
				onPress={handlePress}
				region={{
					latitude: location?.coords.latitude || 37.78825,
					longitude: location?.coords.longitude || -122.4324,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
			>

				{
					destination.latitude != 0 && destination.longitude != 0 && (startTrip || trip) &&
                <Marker
                    coordinate={destination}
                    title="destination"
                    description="destination"
                    onDragEnd={(e) => setDestination(e.nativeEvent.coordinate)}
                />
				}

				{
					driverLocation.latitude != 0 && driverLocation.longitude != 0 && trip &&
                <Marker
                    coordinate={driverLocation}
                    title="driver"
                    description="driver"
                >
                    <Icon name='car' size={30} color='blue'/>
                </Marker>
				}

				{
					routeCoordinates.length != 0 && (startTrip || trip) &&
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#000"
                    strokeColors={[
							  '#7F0000',
							  '#00000000',
							  '#B24112',
							  '#E5845C',
							  '#238C23',
							  '#7F0000'
						  ]}
                    strokeWidth={6}
                />
				}

				{
					driverCoordinates.length !== 0 && trip &&
                <Polyline
                    coordinates={driverCoordinates}
                    strokeColor="#000"
                    strokeColors={[
							  '#7F0000',
							  '#00000000',
							  '#B24112',
							  '#E5845C',
							  '#238C23',
							  '#7F0000'
						  ]}
                    strokeWidth={6}
                />
				}

			</MapView>

			{loading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color="#3498db"/>
				</View>
			)}

			<View style={iconButtonStyles.container}>
				{
					trip ? (
							<TouchableOpacity style={iconButtonStyles.button} onPress={handleFinishTrip}>
								<View style={iconButtonStyles.iconContainer}>
									<Icon name="flag-checkered" size={20} color="#fff"/>
								</View>
								<Text style={iconButtonStyles.buttonText}>Finish trip</Text>
							</TouchableOpacity>
						) :
						!startTrip ? (
							<TouchableOpacity style={iconButtonStyles.button} onPress={handleStartTrip}>
								<View style={iconButtonStyles.iconContainer}>
									<Icon name='play' size={20} color='#fff'/>
								</View>
								<Text style={iconButtonStyles.buttonText}>Start trip</Text>
							</TouchableOpacity>
						) : (

							<>
								<TouchableOpacity style={iconButtonStyles.button} onPress={handleCancelTrip}>
									<View style={iconButtonStyles.iconContainer}>
										<Icon name="times" size={20} color="#fff"/>
									</View>
									<Text style={iconButtonStyles.buttonText}>Cancel</Text>
								</TouchableOpacity>

								<TouchableOpacity style={iconButtonStyles.button} onPress={handleConfirmTrip}>
									<View style={iconButtonStyles.iconContainer}>
										<Icon name="check" size={20} color="#fff"/>
									</View>
									<Text style={iconButtonStyles.buttonText}>Confirm</Text>
								</TouchableOpacity>


							</>
						)
				}
			</View>

		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
	},
	map: {
		width: '100%',
		height: '100%',
	},
	navigateButton: {
		backgroundColor: 'blue',
		padding: 10,
		borderRadius: 5,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	buttonView: {
		position: 'absolute',
		bottom: 20,
		left: 20,
	},
	button: {
		backgroundColor: COLORS.primary,
		height: 45,
		borderRadius: 20,
	},
	loadingOverlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent background
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 999, // Adjust the zIndex to make sure it's above the map
	},
});

const iconButtonStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 20,
		left: 20,
	},
	button: {
		flex: 1,
		marginHorizontal: 5,
		backgroundColor: '#3498db', // Set your desired background color for buttons
		borderRadius: 20,
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconContainer: {
		marginRight: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
	},
});