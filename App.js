// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/(tabs)/index';
import VideoPlayerScreen from './app/VideoPlayerScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1126', // Set header background color
          },
          headerTintColor: '#fff', // Set header text color
          headerTitleStyle: {
            fontWeight: 'bold', // Customize title font style
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Chukkl' }}
        />
        <Stack.Screen 
          name="VideoPlayer" 
          component={VideoPlayerScreen} 
          options={{ title: 'Playing Now' }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
