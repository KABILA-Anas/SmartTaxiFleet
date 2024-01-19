import React, {useState} from 'react'
import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native'

import {COLORS} from '../constants/theme'
import {useRouter} from "expo-router";

import InputComponent from '../components/InputComponent';
import SubmitButtonComponent from '../components/SubmitButtonComponent';
import AuthService from "../services/AuthService";

export default function SignupForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter()

    const handleRegister = () => {
        const user = {
            'email': username,
            'password': password,
            'firstName': 'John',
            'lastName': 'Doe',
            'phone': '1234567890',
            'cin': 'BB123456',

        };
        Alert.alert(JSON.stringify(user));
        AuthService.register(user,'passenger')
        .then(() => {
            router.push("/signin")
        })
        .catch((error) => {
            console.log(error);
            Alert.alert("Register Failed!");
        });
    }

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.inputView}>
                <InputComponent 
                        value={username} 
                        onChange={setUsername} 
                        placeholder="EMAIL" 
                        inputStyle={styles.input}
                />
                <InputComponent 
                    value={password} 
                    onChange={setPassword} 
                    placeholder="PASSWORD" 
                    type="password" 
                    inputStyle={styles.input}
                />
                <InputComponent 
                    value={confirmPassword} 
                    onChange={setConfirmPassword} 
                    placeholder="CONFIRM PASSWORD" 
                    type="password" 
                    inputStyle={styles.input}
                />
            </View>

            <SubmitButtonComponent
                text="Sign Up"
                onPress={handleRegister}
                viewStyle={styles.buttonView}
                pressableStyle={styles.button}
                textStyle={styles.buttonText}
            />

            <Text style={styles.footerText}>
                Already Have Account?
                <Text style={styles.signup} onPress={
                    () => router.push("/signin")
                }>
                    Sign In
                </Text>
            </Text>


        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
    },
    image: {
        height: 160,
        width: 170
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 40,
        color: "black"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 5
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderRadius: 7,
        backgroundColor: "#F6F6F6",
    },
    button: {
        backgroundColor: COLORS.primary,
        height: 45,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 50,
        paddingVertical: 20,
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    footerText: {
        textAlign: "center",
        color: "gray",
        paddingTop: 20,
    },
    signup: {
        color: COLORS.primary,
        fontSize: 13
    }
})