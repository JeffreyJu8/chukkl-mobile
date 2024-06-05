// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './app/index'; 

export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
