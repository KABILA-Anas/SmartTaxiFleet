import React, { useState, useEffect } from 'react';
import MapView, {PROVIDER_DEFAULT, Region, Marker, Polyline} from "react-native-maps";
import { StyleSheet, View, Text, ScrollView, Animated, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {COLORS} from '../../../constants/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationService from '../../../services/LocationService';
import CardComponent from '../../../components/CardComponent';
import MapViewDirections from 'react-native-maps-directions';
//import {useSession} from "../../../auth/AuthContext";


export default function HomePage() {

    const Google_API_KEY = 'AIzaSyBz6vgE5rU0u6-Mi5R5hTwW9L93m_fCSYE';

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<String | null>(null);
    const [currRegion, setCurrentRegion] = useState<Region | null>(null);
    const [destination, setDestination] = useState<any | null>(null); //destination to be matched with driver
    const [passenger, setPassenger] = useState<any | null>(null); //passenger to be matched with driver
    const [isOnTrip, setIsOnTrip] = useState<boolean>(false);
    const [passengers, setPassengers] = useState<any[]>([
        {
            id: 1,
            name: 'John Doe1',
            location: {
                latitude: 33.71774591127574,
                longitude: -7.35055675730109,
            },
        },
        {
            id: 2,
            name: 'John Doe2',
            location: {
                latitude: 33.69042727337634,
                longitude: -7.357646506279707,
            },
        }
    ]);
    const mapRef = React.useRef<MapView>(null);
    const scrollRef = React.useRef<ScrollView>(null);
    //const { accessToken } = useSession()
    
    // get distance between two points using google maps api
    const getDistance = async (origin: any, destination: any) => {
        try {
            let response = await fetch(
                `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${Google_API_KEY}`
            );
            let json = await response.json();
            return json.rows[0].elements[0].distance.text;
        } catch (error) {
            console.error(error);
        }
    };

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

    const getMarkerColor = async(passenger: any) => {
        const distance = await getDistance(location?.coords, passenger.location);
        const color = getMarkerColorByDistance(parseFloat(distance));
        return {distance, color};
    }

    const getPassengers = () => {
        setPassengers(passengers.map((passenger) => {
            getMarkerColor(passenger).then(({distance, color}) => {
                passenger.color = color;
                passenger.distance = distance;
            });
            return passenger;
        }));
    }

    /**Api functions */
    const sendLocation = () => {
        if (location) {
            setInterval(() => {
                LocationService.sendLocation(location);
            }, 10000);
        }
    }

    const getNearbyPassengers = () => {
    }
    

    const handleMarkerPress = (index: number) => {
        scrollRef.current?.scrollTo({
            x: index * 300,
            animated: true,
        });
    }

    const handleAutoMatch = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setDestination({
                latitude: 33.69042727337634,
                longitude: -7.357646506279707,
            });
            setPassenger({
                id: 1,
                name: 'John Doe1',
                location: {
                    latitude: 33.71774591127574,
                    longitude: -7.35055675730109,
                },
            });
            setIsOnTrip(true);
        }, 3000);
    }


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            //let location = await Location.getCurrentPositionAsync({});
            setLocation(await Location.getCurrentPositionAsync({}));

            setInterval(async () => {
                setLocation(await Location.getCurrentPositionAsync({}));
                console.log('location updated', location);
            }, 10000);

           //sendLocation()
        })();
    }, []);

    useEffect(() => {
        if (location != null) {
            getPassengers();
            //console.log('passengers', passengers);
        }
    }, [location]);

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
                    <MapViewDirections
                        origin={location?.coords}
                        destination={destination}
                        apikey={Google_API_KEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onError={(errorMessage) => {
                            console.log('GOT AN ERROR');
                        }}
                    />
                
                    <MapViewDirections
                        origin={location?.coords}
                        destination={passenger.location}
                        apikey={Google_API_KEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onError={(errorMessage) => {
                            console.log('GOT AN ERROR');
                        }}
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