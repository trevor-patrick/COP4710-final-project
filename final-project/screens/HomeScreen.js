import firebaseApp from '../firebase.js';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Alert, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';

var database = firebaseApp.database();



export default function HomeScreen() {
  const [gameNameInput, setGameNameInput] = React.useState(null)
  const [keyInput, setKeyInput] = React.useState(null)
  return (
    <View style={styles.container}>
      {/* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> */}

      <View style={styles.form}>

        <TextInput
          style={styles.input}
          placeholder="Game name"
          onChangeText={(text) => setGameNameInput(text)}>
        </TextInput>

        <TextInput
          style={styles.input}
          placeholder="Key"
          onChangeText={(text) => setKeyInput(text)}
        >
        </TextInput>

        <TouchableOpacity style={styles.button} onPress={() => addGameToDatabase(gameNameInput, keyInput)}>
          <Text style={styles.buttonText}>Add game to database</Text>
        </TouchableOpacity>

      </View>

      {/* </ScrollView> */}

    </View>
  );
}

function addGameToDatabase(gameName, key) {
  console.log(gameName);
  console.log(key);
  var ref = database.ref("games");

  ref.push({
    gameName: gameName,
    key: key
  })
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    // backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "lightblue",
    padding: 4,
    marginBottom: 10,
    width: "100%",
    // borderRadius: 10,
    // overflow: 'hidden'
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center"
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 200,
    overflow: 'hidden'
  },
  form: {
    width: "15%"
  }
});
