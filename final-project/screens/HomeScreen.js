import firebaseApp from '../firebase.js';
import * as WebBrowser from 'expo-web-browser';
// import * as React from 'react';
import React, { useState, useEffect } from 'react';

import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, MaterialIcons, TextInput, FlatList, Button } from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { render } from 'react-dom';
import { FA5Style } from '@expo/vector-icons/build/FontAwesome5';

var database = firebaseApp.firestore();

export default function HomeScreen() {
  const [games, setGames] = React.useState([])
  const [sortGame, setsortGame] = React.useState(true)
  const [sortPrice, setsortPrice] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
  const [reducedGames, setReducedGames] = React.useState([])
  const [test, setTest] = React.useState("null")
  const [searchTitle, setSearchTitle] = React.useState("null")

  useEffect(() => {

    database.collection("games").onSnapshot(querySnapshot => {
      const games = [];
      querySnapshot.forEach(documentSnapshot => {
        games.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });

      });
      setGames(games);
      setLoading(false);
    });

  }, []);

  //function to delete item from database
  const pressHandler = (gameName, key) => {
    if (firebaseApp.auth().currentUser.uid.toString() == "XjA4BoMlXWgQWwcvJgk1TcCvCL82") {
      games.forEach(item => {
        if (item.gameName == gameName && item.key == key) {
          database.collection("games").doc(item.key).delete();
        }
      })
      reducedGames.forEach(item => {
        if (item.gameName == gameName && item.key == key) {
          database.collection("games").doc(item.key).delete();
        }
      })
      // removes game from games state without having to refresh page
      setGames((prevGames) => {
        return prevGames.filter(games => games.key != key);
      });

      // removes game from reducedGames state without having to refresh page
      setReducedGames((prevGames) => {
        return prevGames.filter(reducedGames => reducedGames.key != key);
      });
    }
  }

  //function to sort data from database
  function sortGameAscending() {
    if (sortGame) {
      var ref = database.collection("games").orderBy("gameName");
      ref.onSnapshot(querySnapshot => {
        const games = [];
        querySnapshot.forEach(documentSnapshot => {
          games.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setGames(games);
        setLoading(false);
        setsortGame(false);
      });
    }
    else {
      sortGameDescending();
    }
  }
  function sortGameDescending() {
    if (!sortGame) {
      var ref = database.collection("games").orderBy("gameName", "desc");
      ref.onSnapshot(querySnapshot => {
        const games = [];
        querySnapshot.forEach(documentSnapshot => {
          games.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setGames(games);
        setLoading(false);
        setsortGame(true);
      });

    }
    else {
      sortGameAscending();
    }
  }
  //function to sort descending by price
  function sortPriceDescending() {
    if (!sortPrice) {
      var ref = database.collection("games").orderBy("price", "desc");
      ref.onSnapshot(querySnapshot => {
        const games = [];
        querySnapshot.forEach(documentSnapshot => {
          games.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setGames(games);
        setLoading(false);
        setsortPrice(true);
      });
    }
    else {
      sortPriceAscending();
    }
  }
  function sortPriceAscending() {
    if (sortPrice) {
      var ref = database.collection("games").orderBy("price");
      ref.onSnapshot(querySnapshot => {
        const games = [];
        querySnapshot.forEach(documentSnapshot => {
          games.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setGames(games);
        setLoading(false);
        setsortPrice(false);
      });
    }
    else {
      sortPriceDescending()
    }
  }
  function userSignOut() {
    firebaseApp.auth().signOut().then(function () {
      sessionStorage.setItem('userName', null);
      sessionStorage.setItem('isSignedIn', false);
      window.location = "http://localhost:19006/Login";
    }).catch(function (error) {
      console.error('Sign Out Error', error);
    })
  }

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
          <View style={{ flexDirection: "row", paddingTop: 8 }}>
            <View style={{ paddingLeft: 8 }}>
              <Button title="Sort by Name" onPress={() => sortGameAscending()} />
            </View>
            <View style={{ paddingLeft: 8 }}>
              <Button title="Sort by Price" onPress={() => sortPriceAscending()} />
            </View>
            <View style={{ paddingLeft: 8 }}>
              <Button title="Sign Out" onPress={() => userSignOut()} />
            </View>
          </View>
        </View>


        <FlatList
          data={(reducedGames[0] != null) ? reducedGames : games}
          renderItem={({ item }) => (
            // added on click event
            <TouchableOpacity onPress={() => pressHandler(item.gameName, item.key)}>
              <Item item={item} />
            </TouchableOpacity>
          )}
        />
      </ScrollView>

    </View >
  );
}


// gets all games from database. Returns list of objects, weach with gameName, imageUrl, and key
function getAllGames() {
  var ref = database.collection("games");
  var games = null;
  var gamesList = [];
  ref.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      games.push(doc.data());
    });
    // console.log(doc);
    // gamesList.push(doc);
  });

  var keys = Object(games);
  for (const key in games) {
    // console.log(games[key]);
    gamesList.push(games[key]);
  }
  gamesList.forEach(function (test) {
    console.log(test);
  });

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
      <br />
      <Image
        style={{ width: 100, height: 100 }}
        source={{ uri: item.imageUrl }}
        resizeMode='contain'>
      </Image>
      <br />
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
  },
  buttonSort: {
    margin: 200
  }

});
