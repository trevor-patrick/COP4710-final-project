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

export default function CustomersScreen() {
  var flag = false;
  const [customers, setcustomers] = React.useState([])
  const [sort, setsort] = React.useState(true)
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [reducedcustomers, setReducedcustomers] = React.useState([])
  const [searchTitle, setSearchTitle] = React.useState("null")

  useEffect(() => {
    var customers = [];
    var orders = [];
    database.collection("customers").onSnapshot(querySnapshot => {

      querySnapshot.forEach(documentSnapshot => {
        customers.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });

      });
      setcustomers(customers);
    });
    database.collection("orders").onSnapshot(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        orders.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id
        });
      });
    });
    setOrders(orders);
    setLoading(false);

  }, [], []);

  //function to delete item from database
  const pressHandler = (obj, custName, key) => {
    if (firebaseApp.auth().currentUser.uid.toString() == "XjA4BoMlXWgQWwcvJgk1TcCvCL82") {
      customers.forEach(item => {
        if (item.custName == custName && item.key == key) {
          database.collection("customers").doc(item.key).delete();
        }
      })
      reducedcustomers.forEach(item => {
        if (item.custName == custName && item.key == key) {
          database.collection("customers").doc(item.key).delete();

        }
      })
      orders.forEach(item => {
        if (item.custName == obj.custName && item.custEmail == obj.custEmail) {
          database.collection("orders").doc(item.key).delete();
        }
      })
      // removes game from customers state without having to refresh page
      setcustomers((prevcustomers) => {
        return prevcustomers.filter(customers => customers.key != key);
      });

      // removes game from reducedcustomers state without having to refresh page
      setReducedcustomers((prevcustomers) => {
        return prevcustomers.filter(reducedcustomers => reducedcustomers.key != key);
      });
      setOrders((prevOrders) => {
        return prevOrders.filter(orders => orders.custEmail != obj.custEmail)
      })
      location.reload();
    }
  }
  //function to sign user out
  function userSignOut() {
    firebaseApp.auth().signOut().then(function () {
      localStorage.setItem('userName', null);
      localStorage.setItem('isSignedIn', false);
      window.location = "http://localhost:19006/Login";
    }).catch(function (error) {
      console.error('Sign Out Error', error);
    })
  }
  //function to sort data from database
  function sortAscending() {
    if (sort) {
      var ref = database.collection("customers").orderBy("custName");

      ref.onSnapshot(querySnapshot => {
        const customers = [];
        querySnapshot.forEach(documentSnapshot => {
          customers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setsort(false);
        setcustomers(customers);
        setLoading(false);
      });
    }
    else {
      sortDescending();
    }
  }
  //function to sort descending by name
  function sortDescending() {
    if (!sort) {
      var ref = database.collection("customers").orderBy("custName", "desc");

      ref.onSnapshot(querySnapshot => {
        const customers = [];
        querySnapshot.forEach(documentSnapshot => {
          customers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setsort(true)
        setcustomers(customers);
        setLoading(false);
      });
    } else {
      sortAscending();
    }
  }

  return (
    <View style={styles.container}>

      <ScrollView>

        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.textInput}
            placeholder="Search by name..."
            maxLength={20}
            onChangeText={(text) => setSearchTitle(text)}
          />

          <TouchableOpacity onPress={() => {
            setReducedcustomers(reduceByTitle(customers, searchTitle))
          }}>
            <Icon name="search" style={styles.icon}>
            </Icon>

          </TouchableOpacity>
          <View style={{ flexDirection: "row", paddingTop: 8 }}>
            <View style={{ paddingLeft: 8 }}>
              <Button title="Sort by Name" onPress={() => sortAscending()} />
            </View>
            <View style={{ paddingLeft: 8 }}>
              <Button title="Sign Out" onPress={() => userSignOut()} />
            </View>
          </View>
        </View>


        <FlatList
          data={((reducedcustomers[0] != null) ? reducedcustomers : customers)}
          renderItem={({ item }) => {
            var allorders = [];
            for (let x = 0; x < orders.length; x++) {

              if (orders[x].custName == item.custName) {
                allorders.push("- Title:  " + orders[x].gameName.toString() + ", Price:  $" + orders[x].gamePrice.toString() + "\n")
              }
            }


            return (
              <TouchableOpacity onPress={() => pressHandler(item, item.custName, item.key)}>
                <View style={styles.item}>
                  <Text style={styles.title}>Name: {item.custName}</Text>
                  <br />
                  <Text style={styles.title}>Email: {item.custEmail}</Text>
                  <br />
                  <Text style={styles.title}>Orders:</Text>
                  <br />
                  <View>

                    <Text style={styles.orders}>
                      {allorders}
                    </Text>

                  </View>
                  <br />
                </View>

              </TouchableOpacity>
            )
          }}
        />
      </ScrollView>

    </View >
  );
}


// gets all customers from database. Returns list of objects, weach with gameName, imageUrl, and key
function getAllcustomers() {
  var ref = database.collection("customers");
  var customers = null;
  var customersList = [];
  ref.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      customers.push(doc.data());
    });
    // console.log(doc);
    // customersList.push(doc);
  });

  var keys = Object(customers);
  for (const key in customers) {
    // console.log(customers[key]);
    customersList.push(customers[key]);
  }
  customersList.forEach(function (test) {
    console.log(test);
  });

  return customersList;
}

// this function just changes whats in the customers state 
function reduceByTitle(allcustomers, title) {
  if (title == "" || title == null) {
    return [];
  }

  var customersWithTitle = [];

  // copy allcustomers to customersWithQuery, only customers with title 'LIKE' query
  for (let i = 0; i < allcustomers.length; i++) {
    if (allcustomers[i].gameName.includes(title)) {
      customersWithTitle.push(allcustomers[i]);
    }
  }

  return customersWithTitle;
}


function Item({ item }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>Name: {item.custName}</Text>
      <br />
      <Text style={styles.title}>Email: {item.custEmail}</Text>
      <br />
      <Text style={styles.order}>Orders:</Text>
      <View>
      </View>
    </View>
  );
}

CustomersScreen.navigationOptions = {
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
  orders: {
    fontSize: 16,
    color: "dimgrey"
  }

});
