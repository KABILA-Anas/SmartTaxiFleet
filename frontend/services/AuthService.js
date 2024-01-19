import {Alert} from "react-native";
import {API_BASE_URL} from "../constants/api";

export default class AuthService {

    static register(user, role) {

        return fetch(`${API_BASE_URL}/auth/register/${role}`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                Alert.alert("Success", JSON.stringify(data));
                console.log("register", data);
            });
    }

    static login(user) {
        return fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                Alert.alert("Success", JSON.stringify(data));
            })
    }

    static logout() {
        fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                Alert.alert("Success", JSON.stringify(data));
            })
            .catch(err => {
                Alert.alert("Error", "Something went wrong");
            });
    }
}
