import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import CustomersScreen from '../screens/CustomersScreen';
import ToolsScreen from '../screens/ToolsScreen';
import LoginScreen from '../screens/LoginScreen';
import firebaseApp from '../firebase';
import { withNavigation } from 'react-navigation';
import { hide } from 'expo/build/launch/SplashScreen';
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Login';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (

    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-unlock" />,
        }}
      />
      <BottomTab.Screen
        name="Inventory"
        component={HomeScreen}
        options={{
          title: 'Inventory',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="logo-game-controller-a" />,
        }}
      />

      <BottomTab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code" />,
        }}
      />
      <BottomTab.Screen
        name="Customers"
        component={CustomersScreen}
        options={{
          title: 'Customer Manager',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
      <BottomTab.Screen
        name="Tools"
        component={ToolsScreen}
        options={{
          title: 'Tools',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,

        }}
      />
    </BottomTab.Navigator>
  );
}


function getHeaderTitle(route) {

  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
    
    //var isSignedIn = localStorage.getItem('isSignedIn') || false;
    // if(firebaseApp.auth().currentUser!= null){
    //   var user = firebaseApp.auth().currentUser.email;
    //   console.log(user)
    
      switch (routeName) {
        case 'Login':
          return 'Login'// - Signed in as: ' + user;
        case 'Inventory':
          return 'Inventory'// - Signed in as: ' + user;
        case 'Orders':
          return 'Customer Orders'// - Signed in as: ' + user;
        case 'Customers':
          return 'Customer Manager'// - Signed in as: ' + user;
        case 'Tools':
          return 'Admin Tools'// - Signed in as: ' + user;
      }
  
    // } else {
    //   switch (routeName) {
    //     case 'Login':
    //       return "Login";
    //     case 'Inventory':
    //       return 'Inventory - Not logged in.';
    //     case 'Orders':
    //       return 'Customer Orders - Not logged in.';
    //     case 'Customers':
    //       return 'Customer Manager - Not logged in.';
    //     case 'Tools':
    //       return 'Admin Tools - Not logged in.';
    //   }
//}
  
}
