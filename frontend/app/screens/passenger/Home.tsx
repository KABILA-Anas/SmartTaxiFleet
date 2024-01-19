import React, { useState, useEffect } from 'react';
import MapView, {PROVIDER_DEFAULT, Region, Marker, Polyline} from "react-native-maps";
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {COLORS} from '../../../constants/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationService from '../../../services/LocationService';


export default function HomePage() {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [destination, setdestination] = useState({latitude: 0, longitude: 0});
    const [errorMsg, setErrorMsg] = useState<String | null>(null);
    const [currRegion, setCurrentRegion] = useState<Region | null>(null);
    const [startTrip, setStartTrip] = useState(false);
    const [trip, setTrip] = useState(false);
    const [driverLocation, setDriverLocation] = useState({latitude: 0, longitude: 0});
    const [loading, setLoading] = useState(false);
    const mapRef = React.useRef<MapView>(null);

    const handlePress = (e: any) => {
        if (startTrip) {
            setdestination(e.nativeEvent.coordinate);
        }
    }

    const handleStartTrip = () => {
        setStartTrip(true);
        console.log('Current region: ', currRegion);
    }

    const handleCancelTrip = () => {
        setStartTrip(false);
        setdestination({latitude: 0, longitude: 0});
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
              { text: "OK", onPress: () => {
                setLoading(true);
                setStartTrip(false);

                setTimeout(() => {
                    setTrip(true);
                    setDriverLocation({ latitude: 33.71774591127574, longitude: -7.35055675730109 });
                    setLoading(false);
                }, 3000);

                mapRef.current?.animateToRegion({
                    latitude: location?.coords.latitude || 37.78825,
                    longitude: location?.coords.longitude || -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }, 1000);
              } }
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
              { text: "OK", onPress: () => {
                setTrip(false);
                setdestination({latitude: 0, longitude: 0});
                setDriverLocation({latitude: 0, longitude: 0});
              
                mapRef.current?.animateToRegion({
                    latitude: location?.coords.latitude || 37.78825,
                    longitude: location?.coords.longitude || -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }, 1000);
              } }
            ]
          );
    }

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
                    onDragEnd={(e) => setdestination(e.nativeEvent.coordinate)}
                    />
                }

                {
                    driverLocation.latitude != 0 && driverLocation.longitude != 0 && trip &&
                    <Marker
                    coordinate={driverLocation}
                    title="driver"
                    description="driver"
                    >
                        <Icon name='car' size={30} color='blue' />
                    </Marker>
                }

                {
                    destination.latitude != 0 && destination.longitude != 0 && (startTrip || trip) &&
                    <Polyline
                    coordinates={[
                        {latitude: location?.coords.latitude || 37.78825, longitude: location?.coords.longitude || -122.4324},
                        {latitude: destination.latitude, longitude: destination.longitude},
                    ]}
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
                    driverLocation.latitude != 0 && driverLocation.longitude != 0 && trip &&
                    <Polyline
                    coordinates={[
                        {latitude: location?.coords.latitude || 37.78825, longitude: location?.coords.longitude || -122.4324},
                        {latitude: driverLocation.latitude, longitude: driverLocation.longitude},
                    ]}
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
                <ActivityIndicator size="large" color="#3498db" />
                </View>
            )}

            <View style={iconButtonStyles.container}>
            {
                trip ? (
                    <TouchableOpacity style={iconButtonStyles.button} onPress={handleFinishTrip}>
                        <View style={iconButtonStyles.iconContainer}>
                            <Icon name="flag-checkered" size={20} color="#fff" />
                        </View>
                        <Text style={iconButtonStyles.buttonText}>Finish trip</Text>
                    </TouchableOpacity>
                ) :
                !startTrip ? (
                <TouchableOpacity style={iconButtonStyles.button} onPress={handleStartTrip}>
                    <View style={iconButtonStyles.iconContainer}>
                        <Icon name='play' size={20} color='#fff' />
                    </View>
                    <Text style={iconButtonStyles.buttonText}>Start trip</Text>
                </TouchableOpacity>
                ) : (
            
                <>
                    <TouchableOpacity style={iconButtonStyles.button} onPress={handleCancelTrip}>
                        <View style={iconButtonStyles.iconContainer}>
                            <Icon name="times" size={20} color="#fff" />
                        </View>
                        <Text style={iconButtonStyles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={iconButtonStyles.button} onPress={handleConfirmTrip}>
                        <View style={iconButtonStyles.iconContainer}>
                            <Icon name="check" size={20} color="#fff" />
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