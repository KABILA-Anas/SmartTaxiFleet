import React, { useState, useEffect } from 'react';
import MapView, {PROVIDER_DEFAULT, Region, Marker, Polyline} from "react-native-maps";
import { StyleSheet, View, Text, ScrollView, Animated } from 'react-native';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {COLORS} from '../../../constants/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationService from '../../../services/LocationService';
import CreditCardInfoS from '../../../components/CardComponent';
import CardComponent from '../../../components/CardComponent';
import {useSession} from "../../../auth/AuthContext";


export default function HomePage() {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<String | null>(null);
    const [currRegion, setCurrentRegion] = useState<Region | null>(null);
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

    const { accessToken } = useSession()

    /**Api functions */
    const sendLocation = () => {
        if (location) {
            setInterval(() => {
                LocationService.sendLocation(location);
            }, 10000);
        }
    }


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            setInterval(async () => {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            }, 10000);

           sendLocation()
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
                region={{
                    latitude: location?.coords.latitude || 37.78825,
                    longitude: location?.coords.longitude || -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >

                {
                    passengers.map((passenger) => (
                        <Marker
                            key={passenger.id}
                            coordinate={passenger.location}
                            title={passenger.name}
                            description="3.5km"
                        >
                            <Icon name="user" size={35} color="#900" />
                        </Marker>
                    ))
                }
                
            </MapView>

        <View style={cradsViewStyles.container}>
            <ScrollView
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
                        <CardComponent passenger={passenger} />
                    ))
                }

            </ScrollView>
        </View>

        <View style={iconButtonStyles.container}>
            <TouchableOpacity style={iconButtonStyles.button}>
                <View style={iconButtonStyles.iconContainer}>
                    <Icon name="car" size={20} color="#fff" />
                </View>
                <Text style={iconButtonStyles.buttonText}>Auto match client</Text>
            </TouchableOpacity>
        </View>

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