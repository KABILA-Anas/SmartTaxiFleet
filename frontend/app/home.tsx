import React, { useState, useEffect } from 'react';
import MapView, {PROVIDER_DEFAULT, Region, Marker, Callout, Polyline} from "react-native-maps";
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapViewDirections from 'react-native-maps-directions';


export default function HomePage() {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [destination, setdestination] = useState({latitude: 0, longitude: 0});
    const [errorMsg, setErrorMsg] = useState<String | null>(null);
    const [currRegion, setCurrentRegion] = useState<Region | null>(null);

    const handlePress = (e: any) => {
        setdestination(e.nativeEvent.coordinate);
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
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
                    destination.latitude != 0 && destination.longitude != 0 &&
                    <Marker
                    coordinate={destination}
                    title="destination"
                    description="destination"
                    onDragEnd={(e) => setdestination(e.nativeEvent.coordinate)}
                    />
                }

                {
                    destination.latitude != 0 && destination.longitude != 0 &&
                    <Polyline
                    coordinates={[
                        {latitude: location?.coords.latitude || 37.78825, longitude: location?.coords.longitude || -122.4324},
                        {latitude: destination.latitude, longitude: destination.longitude},
                    ]}
                    strokeColor="#000"
                    strokeColors={[
                        '#7F0000',
                        '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                        '#B24112',
                        '#E5845C',
                        '#238C23',
                        '#7F0000'
                    ]}
                    strokeWidth={6}
                    />
                }

                
            </MapView>

            <View style={{position: 'absolute', bottom: 20, left: 20, right: 0, alignItems: 'center'}}>
                <TouchableOpacity style={styles.navigateButton}>
                    <Text style={styles.buttonText}>Choose Destination</Text>
                </TouchableOpacity>
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
});