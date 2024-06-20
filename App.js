// App.js
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/(tabs)/index';
import VideoPlayerScreen from './app/VideoPlayerScreen';

const Stack = createStackNavigator();

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1126" />
      <Text style={styles.headerText}>
        <Text style={styles.highlight}>ch</Text>kkl
      </Text>
      <Text style={styles.subHeaderText}>Trustworthy Entertainment</Text>
    </View>
  );
};

export default function App() {
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
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => <Header />, // Use custom header
          }}
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

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  highlight: {
    color: '#8aefe7',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#fff',
  },
});
