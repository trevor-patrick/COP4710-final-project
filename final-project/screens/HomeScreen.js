import firebaseApp from '../firebase.js';
import * as WebBrowser from 'expo-web-browser';
// import * as React from 'react';
import React, { useState, useEffect } from 'react';

import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList, Alert } from 'react-native';
import { ScrollView, LongPressGestureHandler } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import { MaterialIcons } from '@expo/vector-icons';

var database = firebaseApp.database();

export default function HomeScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [games, setGames] = React.useState([])
  const [test, setTest] = React.useState("null")

  useEffect(async () => {
    const data = await getAllGames();
    setGames(data);
    console.log("Games:" + data);
  }, []);

  // used to delete games from key and name passed 
  const pressHandler = (gameName, key) =>{
    
    database.ref("games").on("value", function(snapshot){
      snapshot.forEach(function(child){
        var temp = child.val();
        if(temp.gameName == gameName && temp.key == key){
          database.ref("games").child(child.key).remove();
        }
      })
    })
    // removes game from screen without having to refresh page
    setGames((prevGames) => {
      return prevGames.filter(games => games.gameName != gameName); 
    });
  }
  return (
    <View style={styles.container}>
      <ScrollView>
      <FlatList
      
        data={games}
        renderItem={({ item }) => (
          // added on click event
          <TouchableOpacity onPress={() =>  pressHandler(item.gameName, item.key)}
          >
          <Item item={item} />
          </TouchableOpacity>
        )} 
      />
      </ScrollView>

    </View>
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

function Item({ item }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.gameName}</Text>
      <Image
        style={{ width: 100, height: 100 }}
        source={{ uri: item.imageUrl }}
        resizeMode='contain'>
      </Image>
      <Text style={{marginLeft: 39}}>${item.price}</Text>
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
  }

});
