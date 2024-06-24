import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/(tabs)/index';
import VideoPlayerScreen from './app/VideoPlayerScreen';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    NotoSans: require('./assets/fonts/NotoSans.ttf'),
    Rubik_Medium: require('./assets/fonts/Rubik-Medium.ttf'),
    Nunito_Medium: require('./assets/fonts/Nunito-Medium.ttf'),
    Kavoon: require('./assets/fonts/Kavoon-Regular.ttf'),
    ComicNeue_Bold: require('./assets/fonts/ComicNeue-Bold.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1126',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: false // Hide the default header
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
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
