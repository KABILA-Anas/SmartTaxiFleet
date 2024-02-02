import React, {useState} from 'react'
import {Alert, Pressable, SafeAreaView, StyleSheet, Switch, Text, View} from 'react-native'

import {COLORS} from '../constants/theme'
import InputComponent from '../components/InputComponent';
import SubmitButtonComponent from '../components/SubmitButtonComponent';
import {useSession} from "../auth/AuthContext";
import { useRouter } from 'expo-router';

export default function LoginForm() {
    const [click, setClick] = useState(false);
    const [username, setUsername] = useState("driver@gmail.com");
    const [password, setPassword] = useState("12345678");
    const { signIn } = useSession();
    const router = useRouter();


    const handleLogin = () => {
        const user = {
            'username': username,
            'password': password,
        };
        signIn(user)
    }


    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>Sign In</Text>
            <View style={styles.inputView}>
                <InputComponent 
                    value={username} 
                    onChange={setUsername} 
                    placeholder="Email" 
                    inputStyle={styles.input}
                />
                <InputComponent 
                    value={password} 
                    onChange={setPassword} 
                    placeholder="Password" 
                    type="password" 
                    inputStyle={styles.input}
                />
            </View>
            <View style={styles.rememberView}>
                <View style={styles.switch}>
                    <Switch value={click} onValueChange={setClick} trackColor={{true: "green", false: "gray"}}/>
                    <Text style={styles.rememberText}>Remember Me</Text>
                </View>
                <View>
                    <Pressable onPress={() => Alert.alert("Forget Password!")}>
                        <Text style={styles.forgetText}>Forgot Password?</Text>
                    </Pressable>
                </View>
            </View>

            <SubmitButtonComponent
                text="Sign In"
                onPress={handleLogin}
                viewStyle={styles.buttonView}
                pressableStyle={styles.button}
                textStyle={styles.buttonText}
            />
            <Text style={styles.optionsText}>OR LOGIN WITH</Text>
            <Text style={styles.footerText}>
                Don't Have Account?
                <Text style={styles.signup} onPress={
                    () => router.push("/signup")
                }>Sign Up</Text>
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
    rememberView: {
        width: "100%",
        paddingHorizontal: 50,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 8
    },
    switch: {
        flexDirection: "row",
        gap: 1,
        justifyContent: "center",
        alignItems: "center"

    },
    rememberText: {
        fontSize: 13
    },
    forgetText: {
        fontSize: 11,
        color: COLORS.primary
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
        paddingHorizontal: 50
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    mediaIcons: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 23
    },
    icons: {
        width: 40,
        height: 40,
    },
    footerText: {
        textAlign: "center",
        color: "gray",
    },
    signup: {
        color: COLORS.primary,
        fontSize: 13
    }
})