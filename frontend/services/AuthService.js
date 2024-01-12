import {Alert} from "react-native";

const baseURL = 'http://localhost:8080';
export default class AuthService {

    static register(user,role) {
        fetch(`${baseURL}/auth/register/${role}`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            Alert.alert("Success", res.json());
        }).catch(err => {
            Alert.alert("Error", "Something went wrong");
        })
    }

    static login(user) {
        fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            Alert.alert("Success", res.json());
        }).catch(err => {
            Alert.alert("Error", err.toString());
        })
    }

    static logout() {
        fetch(`${baseURL}/auth/logout`, {
            method: 'GET'
        }).then(res => {
            Alert.alert("Success", res.json());
        }).catch(err => {
            Alert.alert("Error", "Something went wrong");
        })
    }
}
