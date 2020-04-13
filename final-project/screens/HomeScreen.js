import firebaseApp from '../firebase.js';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';

var database = firebaseApp.database();

export default function HomeScreen() {

  return (
    <View style={styles.container}>
      {/* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> */}

      {/* <View style={styles.button}> */}
      <Button
        onPress={() => firebaseTest()}
        title="Test button for Firebase"
      />
      {/* </View> */}

      {/* </ScrollView> */}

    </View>
  );
}

function firebaseTest() {
  var ref = database.ref("users");

  ref.set({
    trevor: {
      date_of_birth: "06/01/1998",
      full_name: "Trevor Patrick"
    }
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
    // backgroundColor: "#FFD700",
    padding: 4,
    marginBottom: 10,
    width: "100%",
    borderRadius: 200,
    overflow: 'hidden',
    // height: "5%"
  },
});
