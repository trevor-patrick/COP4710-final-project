import firebaseApp from '../firebase.js';
import * as WebBrowser from 'expo-web-browser';
// import * as React from 'react';
import React, { useState, useEffect } from 'react';

import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, Alert, TextInput, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { render } from 'react-dom';

var database = firebaseApp.database();

export default function HomeScreen() {

  const [games, setGames] = React.useState([])
  const [reducedGames, setReducedGames] = React.useState([])
  const [test, setTest] = React.useState("null")
  const [searchTitle, setSearchTitle] = React.useState("null")

  useEffect(async () => {
    const data = await getAllGames();
    setGames(data);
    console.log("Games:" + data);
  }, []);

  return (
    <View style={styles.container}>

      <ScrollView>

        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.textInput}
            placeholder="Search by title..."
            maxLength={20}
            onChangeText={(text) => setSearchTitle(text)}
          />

          <TouchableOpacity onPress={() => {
            setReducedGames(reduceByTitle(games, searchTitle))
          }}>
            <Icon name="search" style={styles.icon}>
            </Icon>
          </TouchableOpacity>
        </View>

        <FlatList
          data={(reducedGames[0] != null) ? reducedGames : games}
          renderItem={({ item }) => <Item item={item} />}
        />

      </ScrollView>

    </View >
  );
}

// gets all games from database. Returns list of objects, weach with gameName, imageUrl, and key
async function getAllGames() {
  var ref = database.ref("games");
  var games = null;
  var gamesList = [];
  await ref.once('value')
    .then(function (data) {
      // console.log(data.toJSON());
      games = data.toJSON();
    });

  var keys = Object.keys(games);
  for (const key in games) {
    // console.log(games[key]);
    gamesList.push(games[key]);
  }

  return gamesList;
}

// this function just changes whats in the games state 
function reduceByTitle(allGames, title) {
  if (title == "" || title == null) {
    return [];
  }

  var gamesWithTitle = [];

  // copy allGames to gamesWithQuery, only games with title 'LIKE' query
  for (let i = 0; i < allGames.length; i++) {
    if (allGames[i].gameName.includes(title)) {
      gamesWithTitle.push(allGames[i]);
    }
  }

  return gamesWithTitle;
}

function Item({ item }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.gameName}</Text>
      <Image
        style={{ width: 100, height: 100 }}
        source={{ uri: item.imageUrl }}
        resizeMode='contain'>
      </Image>
      <Text style={styles.title}>${item.price}</Text>
    </View>
  );
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
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
  },
  textInput: {
    borderColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 35,
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "left",
    width: 200,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  searchButton: {
    borderColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 35,
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center",
    width: 150,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    // marginHorizontal: 8,
    // marginHorizontal: ,
  },
  icon: {
    marginVertical: 8,
    padding: 9,
    fontSize: 18
    // marginHorizontal: 16,
  }
});
