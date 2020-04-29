import { useLinking } from '@react-navigation/native';
import { Linking } from 'expo';
import Login from "../screens/LoginScreen"
export default function(containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.makeUrl('/')],
    config: {
      Root: {
        path: 'root',
        screens: {
          Login: 'Login',
          Home: 'home',
          Links: 'links',
          Settings: 'settings',
        },
      },
    },
  });
}
