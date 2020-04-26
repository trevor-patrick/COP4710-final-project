import firebaseApp from '../firebase.js';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

var database = firebaseApp.firestore();

export default function ToolsScreen() {
  const [gameNameInput, setGameNameInput] = React.useState(null)
  const [keyInput, setKeyInput] = React.useState(null)
  const [imageUrl, setImageUrl] = React.useState(null)
  const [price, setPrice] = React.useState(null)
  const [error, setError] = React.useState("")

  const [custNameInput, setCustNameInput] = React.useState(null)
  const [custEmailInput, setCustEmailInput] = React.useState(null)
  const [gameInput, setGameInput] = React.useState(null)
  const [gameImage, setGameImageInput] = React.useState(null)
  const [orderPrice, setOrderPrice] = React.useState(null)

  async function addGameToDatabase(gameName, key, imageUrl, price) {
    // check if game already exists with same key

    var ref = database.collection("games");
    var valid = false;
    const snapshot = await ref.get();
    // CONCAT INPUT KEY HERE.. there is where I left off
    const keysInDB = snapshot.docs.map(doc => doc.data().key);
    // console.log(docs)
    // console.log(new Set(docs).size)
    // const duplicateKeys = !(docs.length === new Set(docs).size);
    // console.log("Duplicate: " + duplicateKeys);

    if (keysInDB.includes(keyInput)) {
      setError("* A game with this key exists already")
    }
    else if (gameNameInput == null || gameNameInput == "" ||
      keyInput == null || keyInput == "" ||
      imageUrl == null || imageUrl == "" ||
      price == null || price == "") {
      setError("* Missing input")
    }
    else {
      setError("");
      valid = true;
    }

    if (valid) {
      ref.add({
        gameName: gameName,
        key: key,
        imageUrl: imageUrl,
        price: price
      })

      setGameNameInput("");
      setKeyInput("");
      setImageUrl("");
      setPrice("");
    }



  }

  return (

    // <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    /* <Prompt message="Are you sure you want to leave?" /> */
    < ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} >
      <View style={styles.inputContainer}>

        <Text style={styles.text}>Add game to database</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Game Title"
          maxLength={40}
          onChangeText={(text) => setGameNameInput(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Price (USD)"
          onChangeText={(text) => setPrice(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Image URL"
          onChangeText={(text) => setImageUrl(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Download Key"
          maxLength={40}
          onChangeText={(text) => setKeyInput(text)}
        />
        <TouchableOpacity
          style={styles.insertButton}
          onPress={() => addGameToDatabase(gameNameInput, keyInput, imageUrl, price)}
        >
          <Text style={styles.text}>Add Game</Text>
        </TouchableOpacity>
        <Text style={{ color: "red" }}>{error}</Text>

        <br />
        <br />
        <br />

        <Text style={styles.text}>Add order to database</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Customer Name"
          maxLength={40}
          onChangeText={(text) => setCustNameInput(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Customer Email"
          maxLength={40}
          onChangeText={(text) => setCustEmailInput(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Game Name"
          onChangeText={(text) => setGameInput(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Game Image"
          onChangeText={(text) => setGameImageInput(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Price (USD)"
          maxLength={40}
          onChangeText={(text) => setOrderPrice(text)}
        />
        <TouchableOpacity
          style={styles.insertButton}
          onPress={() => addOrderToDatabase(custNameInput, custEmailInput, gameInput, orderPrice, gameImage)}
        >
          <Text style={styles.text}>Add Order</Text>
        </TouchableOpacity>


      </View>
    </ScrollView >
  );
}



function addOrderToDatabase(custName, custEmail, gameName, price, gameImage) {
  console.log("calling addOrderToDatabase()...")
  
  var ref = database.collection("orders");
  var current_time = Date.now()

  var new_order = {
    custName: custName,
    custEmail: custEmail,
    gameName: gameName,
    gamePrice: price,
    orderTime: current_time,
    image: gameImage
  }
  ref.add(new_order);

  alert("Order created!");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  // contentContainer: {
  //   // paddingTop: ,
  // },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
  inputContainer: {
    padding: 15,
    width: 195
  },
  textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 35,
    fontSize: 12,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center"
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5

  },
  insertButton: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#CCCCCC',
    paddingTop: 3
  },
});





