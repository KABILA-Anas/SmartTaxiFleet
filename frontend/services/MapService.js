import * as Location from 'expo-location';

class MapService {
    async getUserLocation() {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        return location;
    }
}

export default new MapService();