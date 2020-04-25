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

export default function OrdersScreen() {
  const [games, setGames] = React.useState([])
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [reducedOrders, setReducedOrders] = React.useState([])
  const [test, setTest] = React.useState("null")
  const [searchName, setSearchName] = React.useState("null")

  useEffect(() => {

    database.collection("orders").onSnapshot(querySnapshot => {
      const orders = [];
      querySnapshot.forEach(documentSnapshot => {
        orders.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
  
      });
      setOrders(orders);
      setLoading(false);
    });


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
  const pressHandler = (item) => {
    if (item == null)
      return;

    database.collection("orders").doc(item.key).delete();

    // removes game from screen without having to refresh page
    setOrders((prevOrders) => {
      return prevOrders.filter(orders => orders.key != item.key);
    });

    setReducedOrders((prevReducedOrders) => {
      return prevReducedOrders.filter(orders => orders.key != item.key);
    })
  }
  //function to sort data from database
  function sortAscending() {
    var ref = database.collection("games").orderBy("gameName");
    var games = null;
    var gamesList = [];
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
    });
  }
  //function to sort descending by price
  function sortDescending(){
    var ref = database.collection("games").orderBy("price", "desc");
    var games = null;
    var gamesList = [];
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
    });
  }

  return (
    <View style={styles.container}>

      <ScrollView>

        <View style={{ flexDirection: "row"}}>
          <TextInput
            style={styles.textInput}
            placeholder="Search by customer name..."
            maxLength={20}
            onChangeText={(text) => setSearchName(text)}
            defaultValue=""
          />
    
          <TouchableOpacity onPress={() => {
            setReducedOrders(reduceByName(orders, searchName))
          }}>
            <Icon name="search" style={styles.icon}>
            </Icon>
            
          </TouchableOpacity>
          <View style={{flexDirection:"row", paddingTop: 8}}>
          <View style={{paddingLeft: 8}}>
            <Button title="Sort by Name" onPress={() => sortAscending()}/>
            </View>
            <View style={{paddingLeft: 8}}>
            <Button title="Sort by Price" onPress={() => sortDescending()}/>
            </View>
          </View>
         </View>
        

        <FlatList
          data={(reducedOrders[0] != null) ? reducedOrders: orders}
          renderItem={({ item }) => (
            // added on click event
            <TouchableOpacity onPress={() => pressHandler(item)}>
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
  gamesList.forEach(function(test){
    console.log(test);
  });

return gamesList;
}

// gets all orders from database
function getAllOrders() {
  var ref = database.collection("orders");
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
  gamesList.forEach(function(test){
    console.log(test);
  });

return gamesList;
}


// this function just changes whats in the games state 
function reduceByName(allOrders, name) {
  if (name == "" || name == null || allOrders.length == 0) {
    return [];
  }

  var ordersWithTitle = [];

  // copy allOrders to gamesWithQuery, only games with title 'LIKE' query
  for (let i = 0; i < allOrders.length; i++) {
    var curOrder = allOrders[i];

    if (curOrder.custName == null)
      return [];

    if (curOrder.custName.includes(name)) {
      ordersWithTitle.push(curOrder);
    }
  }

  return ordersWithTitle;
}

// displays an order item
function Item({ item }) {
  // TODO: look up game image by name

  var url;
  /*
  games.forEach(g =>{
    if(g.gameName == gameName){
     url = database.collection("games").doc(g.key).get();}
    });
    */

  return (
    <View style={styles.item}>
      <Text style={styles.title}>Customer: {item.custName}</Text>
      <Text style={styles.title}>Email: {item.custEmail}</Text>
      <Text style={styles.title}>Game: {item.gameName}</Text>
      <Image
        style={{ width: 100, height: 100 }}
        source={{ uri: item.imageUrl }}
        resizeMode='contain'>
      </Image>
      <Text style={styles.title}>Order total: ${item.gamePrice}</Text>
    </View>
  );
}

OrdersScreen.navigationOptions = {
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
