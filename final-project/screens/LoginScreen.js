import React from "react";
import { View, Button, TextInput, StyleSheet, Text } from "react-native";
import firebaseApp from "../firebase";
import { StackNavigator } from '@react-navigation/native';
import { FormLabel, FormInput } from '../node_modules/react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";

export default function LoginScreen() {
    const [signedin, setSignIn] = React.useState(false)
    const signIn = () =>{
        var email = document.getElementById("emailInput");
        var password = document.getElementById("passwordInput");
        firebaseApp.auth().signInWithEmailAndPassword(email.value, password.value).then(function(){
            window.location = "http://localhost:19006/root/Inventory";
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + " " + errorMessage)
            document.getElementById("failedSignin").innerText= errorMessage;
        })
    }
    const createAccount = () =>{
        var email = document.getElementById("emailInput");
        var password = document.getElementById("passwordInput");
        if(password.value.length < 6){
            return document.getElementById("failedSignin").innerText= "Invalid password. Must be at least 6 characters long.";
        }
        firebaseApp.auth().createUserWithEmailAndPassword(email.value, password.value).then(function(){
            document.getElementById("failedSignin").innerHTML= "<span style='color:#18d100'>Account created successfully. Click 'Sign In'.</span>";
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("failedSignin").innerText= errorMessage;
          });
    }
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} type="email" placeholder="Enter your email" id="emailInput"></TextInput>
            <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter your password" id="passwordInput"></TextInput>

            <TouchableOpacity onPress={signIn}>
                <Text style={{
                    borderWidth: 1, textAlign: "center", padding: 10, backgroundColor: "#00b7ff", borderColor: "#00b7ff", color: "#ffffff", fontSize: 16, fontWeight: "bold",
                    width: 250, alignSelf: "center", borderRadius: 10, marginTop: 10
                }}>
                    Sign In
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={createAccount}>
                <Text style={{
                    borderWidth: 1, textAlign: "center", padding: 10, backgroundColor: "#00b7ff", borderColor: "#00b7ff", color: "#ffffff", fontSize: 16, fontWeight: "bold",
                    width: 250, alignSelf: "center", borderRadius: 10, marginTop: 10
                }}>
                    Create Account
                </Text>
            </TouchableOpacity>
            <Text id="failedSignin" style={{alignSelf: "center", color:"red", margin: 10, fontWeight:"bold"}}></Text>
        </View >
    );

}
const styles = StyleSheet.create({
    container: {
        paddingTop: 250,
        alignSelf: "center",
    },
    input: {
        fontSize: 16,
        margin: 10,
        height: 40,
        width: 370,
        alignSelf:"center",
        borderBottomWidth: 1,
        borderColor: "#00b7ff"
    },
})