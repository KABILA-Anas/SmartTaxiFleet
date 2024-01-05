import React, {useState} from 'react'
import {Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native'

import {COLORS} from '../constants/theme'
import {useRouter} from "expo-router";

export default function SignupForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter()
    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.inputView}>
                <TextInput style={styles.input} placeholder='EMAIL' value={email} onChangeText={setEmail}
                           autoCorrect={false}
                           autoCapitalize='none'/>
                <TextInput style={styles.input} placeholder='USERNAME' value={username} onChangeText={setUsername}
                           autoCorrect={false}
                           autoCapitalize='none'/>
                <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password}
                           onChangeText={setPassword} autoCorrect={false}
                           autoCapitalize='none'/>
                <TextInput style={styles.input} placeholder='CONFIRM PASSWORD' secureTextEntry value={confirmPassword}
                           onChangeText={setConfirmPassword} autoCorrect={false}
                           autoCapitalize='none'/>
            </View>

            <View style={styles.buttonView}>
                <Pressable style={styles.button} onPress={() => Alert.alert("Signup Successfuly!",
                    "see you in my instagram if you have questions : must_ait6")}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
            </View>

            <Text style={styles.footerText}>
                Already Have Account?
                <Text style={styles.signup} onPress={
                    () => router.push("/signin" as never)
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