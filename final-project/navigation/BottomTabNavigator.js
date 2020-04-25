import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import CustomersScreen from '../screens/CustomersScreen';
import ToolsScreen from '../screens/ToolsScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Browse';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
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

  switch (routeName) {
    case 'Inventory':
      return 'Inventory';
    case 'Orders':
      return 'Customer Orders';
    case 'Customers':
      return 'Customer Manager';
    case 'Tools':
      return 'Admin Tools';
  }
}
