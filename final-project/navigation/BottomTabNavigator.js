import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import LibraryScreen from '../screens/LibraryScreen';
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
        name="Browse"
        component={HomeScreen}
        options={{
          title: 'Browse games',
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
        name="Library"
        component={LibraryScreen}
        options={{
          title: 'Library',
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
    case 'Browse':
      return 'Database Tools';
    case 'Orders':
      return 'Customer Orders';
    case 'Library':
      return 'My library';
    case 'Tools':
      return 'Admin Tools';
  }
}
