import React, { useState, useEffect, useRef } from 'react';
import MapView, {PROVIDER_DEFAULT, Region, Marker, Polyline} from "react-native-maps";
import { StyleSheet, View, Text, ScrollView, Animated, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {COLORS} from '../../../constants/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationService from '../../../services/LocationService';
import CardComponent from '../../../components/CardComponent';
import TripService from '../../../services/TripService';


export default function HomePage() {


    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<String | null>(null);
    const [currRegion, setCurrentRegion] = useState<Region | null>(null);
    const [destination, setDestination] = useState<any | null>(null); //destination to be matched with driver
    const [passenger, setPassenger] = useState<any | null>(null); //passenger to be matched with driver
    const [routeCoordinates, setRouteCoordinates] = useState<Array<any>>([]);
	const [passengerCoordinates, setPassengerCoordinates] = useState<Array<any>>([]);
    const [isOnTrip, setIsOnTrip] = useState<boolean>(false);
    const [passengers, setPassengers] = useState<any[]>([]);
    const mapRef = React.useRef<MapView>(null);
    const scrollRef = React.useRef<ScrollView>(null);
    const locationRef = useRef<Location.LocationObject | null>(location);
    const passengerCoordinatesRef = useRef<Array<any>>(passengerCoordinates);
    const routeCoordinatesRef = useRef<Array<any>>(routeCoordinates);
    //const { accessToken } = useSession()
    
    // get router
    const getRouteCoordinates = (origin: any, destination: any) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?access_token=pk.eyJ1IjoiMHg0bnMiLCJhIjoiY2xvNjNjYXI0MDFwdTJsbXN4Y3NrcHgxOCJ9.FD6viYFpWMcdE8FJkrqUZw&geometries=geojson`;
        console.log('Route url: ', url);
        return fetch(url)
            .then((res) => res.json())
    }
    // get distance between two points using google maps api
    const getDistance = async (origin: any, destinations: any) => {
        try {
            const apiUrl = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${origin.longitude},${origin.latitude};${destinations}?access_token=pk.eyJ1IjoiMHg0bnMiLCJhIjoiY2xvNjNjYXI0MDFwdTJsbXN4Y3NrcHgxOCJ9.FD6viYFpWMcdE8FJkrqUZw&annotations=distance&sources=0`;
            console.log(`apiUrl: ${apiUrl}`);
            let response = await fetch(apiUrl);
            let json = await response.json();
            console.log(`response json : ${json.distances[0].length}`);
            if(json.distances[0].length == 0 && (json.code as string).toUpperCase() !== 'OK')
                return [];
            (json.distances[0] as any[]).shift();
            return json.distances[0].map((distance: number) => (distance / 1000).toFixed(2));
        } catch (error) {
            console.error(error);
        }
    };
    const handleRefreshRoutes = () => {
        getRouteCoordinates(location?.coords, passenger?.location)
        .then((res) => {
            console.log('Passenger Route: ', res);
            passengerCoordinatesRef.current = res.routes[0].geometry.coordinates.map((coordinate: any) => {
                return {
                    latitude: coordinate[1],
                    longitude: coordinate[0]
                }
            });
            setPassengerCoordinates(passengerCoordinatesRef.current);
        });

        getRouteCoordinates(passenger?.location, destination)
        .then((res) => {
            console.log('Route: ', res);
            routeCoordinatesRef.current = res.routes[0].geometry.coordinates.map((coordinate: any) => {
                return {
                    latitude: coordinate[1],
                    longitude: coordinate[0]
                }
            });
            setRouteCoordinates(routeCoordinatesRef.current);
        });
    }

    const getMarkerColorByDistance = (distance: number) => {
        if (distance < 1) {
            return 'green';
        } else if (distance < 2) {
            return 'orange';
        } else {
            return 'red';
        }
    };

    const getMarkerSizeByDistance = (distance: number) => {
        if (distance < 1) {
            return 20;
        } else if (distance < 2) {
            return 15;
        } else {
            return 10;
        }
    };

    /**Api functions */
    const sendLocation = async() => {
        console.log('start getting location');
        const location = await Location.getLastKnownPositionAsync({});
        setLocation(location);
        locationRef.current = location;
        console.log('start sending location : ', location?.coords);

        if(location && location.coords){
            await LocationService.sendLocation({latitude: location.coords.latitude, longitude: location.coords.longitude})
        }
        setTimeout(async() => {
            await sendLocation();
        }, 10000);
        
    }

    const getNearbyPassengers =async() => {
       //setTimeout(async() => {
           // const location = await Location.getCurrentPositionAsync({});
           const localLocation = locationRef.current;
            console.log('start getting nearby trips : ', localLocation?.coords);
            if(localLocation?.coords && !isOnTrip){
                TripService.nearbyTrips({latitude: localLocation.coords.latitude, longitude: localLocation.coords.longitude})
                .then(async (trips) => {
                    if(trips.length == 0)
                        return [];
                    
                    const distances = await getDistance(localLocation?.coords, trips.reduce((acc: string, trip: any) => {
                        return acc + ';' + trip.departureLongitude + ',' + trip.departureLatitude;
                    }, '').substring(1));
                    console.log('distances: ', distances);
                    return trips.map((trip: any, index: number) => {
                        return {
                            id: trip.id,
                            name: trip.passenger.firstName,
                            location: {
                                latitude: trip.departureLatitude,
                                longitude: trip.departureLongitude,
                            },
                            distance: `${distances[index]} Km`,
                            color: getMarkerColorByDistance(parseFloat(distances[index]))
                        }
                    });
                })
                .then((passengers) => {
                    setPassengers(passengers);
                })
            }
            setTimeout(async() => {
                await getNearbyPassengers();
            }, 10000);
        //}, 10000);
        
    }
    

    const handleMarkerPress = (index: number) => {
        scrollRef.current?.scrollTo({
            x: index * 300,
            animated: true,
        });
    }

    const handleAutoMatch = () => {
        setLoading(true);
        TripService.autoMatchTrip()
        .then(() => {
            console.log('auto match trip success');
            getTripInProgress();
        });
    }

    const getTripInProgress = () => {
        let interval = setInterval(() => {
            TripService.tripInProgress()
            .then(({trip,userLocation}) => {
                console.log('Trip in progress: ', trip);
                if(trip?.status == 'ACCEPTED'){	
                    setDestination({
                        latitude: trip.destinationLatitude,
                        longitude: trip.destinationLongitude,
                    });
                    setPassenger({
                        id: trip.id,
                        name: trip.passenger.firstName,
                        location: {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        },
                    });

                    if(passengerCoordinatesRef.current.length == 0){
                        getRouteCoordinates(location?.coords, userLocation)
                        .then((res) => {
                            console.log('Passenger Route: ', res);
                            passengerCoordinatesRef.current = res.routes[0].geometry.coordinates.map((coordinate: any) => {
                                return {
                                    latitude: coordinate[1],
                                    longitude: coordinate[0]
                                }
                            });
                            setPassengerCoordinates(passengerCoordinatesRef.current);
                        });
                    }
                    if(routeCoordinatesRef.current.length == 0){
                        getRouteCoordinates(userLocation, {
                            latitude: trip.destinationLatitude,
                            longitude: trip.destinationLongitude,
                        })
                        .then((res) => {
                            console.log('Route: ', res);
                            routeCoordinatesRef.current = res.routes[0].geometry.coordinates.map((coordinate: any) => {
                                return {
                                    latitude: coordinate[1],
                                    longitude: coordinate[0]
                                }
                            });
                            setRouteCoordinates(routeCoordinatesRef.current);
                        });
                    }

                    setLoading(false);
                    setIsOnTrip(true);
                }
            })
            .catch((error) => {
                console.log('Trip in progress error: ', error);
                clearInterval(interval);
                setLoading(false);
                setIsOnTrip(false);
                setPassengerCoordinates([]);
                passengerCoordinatesRef.current = [];
                setRouteCoordinates([]);
                routeCoordinatesRef.current = [];
                setPassenger(null);
                setDestination(null);
            });
        }, 8000);
    }

    useEffect(() => {
            Location.requestForegroundPermissionsAsync()
            .then(async({status}) => {
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                const location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                locationRef.current = location;

                setTimeout(async() => {
                    await sendLocation();
                    await getNearbyPassengers();
                }, 1000);
            })
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
                region={{
                    latitude: location?.coords.latitude || 37.78825,
                    longitude: location?.coords.longitude || -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >

                {
                    !isOnTrip && passengers.map((passenger, index) => (
                        <Marker
                            key={passenger.id}
                            coordinate={passenger.location}
                            title={passenger.name}
                            description={passenger.distance}
                            onPress={() => handleMarkerPress(index)}
                        >
                            <Icon name="user" size={35} color={passenger.color} />
                        </Marker>
                    ))
                }

                {
                isOnTrip && (
                    <>

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

                    <Polyline
                        coordinates={passengerCoordinates}
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
				
                    <Marker
                        coordinate={passenger.location}
                        title={passenger.name}
                        description="3.5km"
                    >
                        <Icon name="user" size={35} color="#900" />
                    </Marker>
                    
                    <Marker
                        coordinate={destination}
                        title="Destination"
                        description="3.5km"
                    >
                        <Icon name="flag" size={35} color="#900" />
                    </Marker>
                    </>
                )
            }
                
            </MapView>

            
			{loading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color="#3498db"/>
				</View>
			)}
            
            

    { !isOnTrip && (
        <>
        <View style={cradsViewStyles.container}>
            <ScrollView
                ref={scrollRef}
                horizontal
                scrollEventThrottle={1}
                contentContainerStyle={cradsViewStyles.carouselContainer}
                showsHorizontalScrollIndicator={false}
                snapToInterval={300}
                onScroll={Animated.event(
                    [
                        {
                        nativeEvent: {
                            contentOffset: {
                            x: new Animated.Value(0),
                            },
                        },
                        },
                    ],
                    { useNativeDriver: false }
                    )}
            >

                {
                    passengers.map((passenger) => (
                        <CardComponent
                            key={passenger.id}
                            passenger={passenger}
                            onPress={() => {
                                setLoading(true);
                                TripService.acceptTrip(passenger.id)
                                .then(() => {
                                    console.log('accept trip success');
                                    getTripInProgress();
                                });
                            }} 
                        />
                    ))
                }

            </ScrollView>
        </View>
    

        <View style={iconButtonStyles.container}>
            <TouchableOpacity
                    style={iconButtonStyles.button}
                    onPress={handleAutoMatch}
            >
                <View style={iconButtonStyles.iconContainer}>
                    <Icon name="car" size={20} color="#fff" />
                </View>
                <Text style={iconButtonStyles.buttonText}>Auto match client</Text>
            </TouchableOpacity>
        </View>
        </>
        )}

        {isOnTrip && (
            <View style={iconButtonStyles.container}>
                <TouchableOpacity style={iconButtonStyles.button} onPress={handleRefreshRoutes}>
                    <View style={iconButtonStyles.iconContainer}>
                        <Icon name="refresh" size={20} color="#fff"/>
                    </View>
                    <Text style={iconButtonStyles.buttonText}>Refresh Route</Text>
                </TouchableOpacity>
            </View>
        )}

        </View>
    );
}

const cradsViewStyles = StyleSheet.create({
    container: {
        paddingTop:10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      carouselContainer: {
        marginVertical: 40,
        alignItems: 'center',
      },
});

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