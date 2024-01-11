import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function App() {
    const [origin, setOrigin] = useState({
            latitude: 37.78825,
            longitude: -122.4324,
    });

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }}   
     >
        <Marker
            draggable
            coordinate={origin}
            title="Origin"
            description="Origin"
            onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}
        />
    </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
