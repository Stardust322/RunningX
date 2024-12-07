import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import RunComponent from './src/screens/RunComponent'
import MainComponent from './src/screens/MainComponent'

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainComponent} />
        <Stack.Screen name="Run" component={RunComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}