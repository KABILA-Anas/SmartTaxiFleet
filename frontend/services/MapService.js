import * as Location from 'expo-location';

class MapService {
    async getUserLocation() {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
        }

        return await Location.getCurrentPositionAsync({});
    }
}

const mapService = new MapService();
export default mapService;