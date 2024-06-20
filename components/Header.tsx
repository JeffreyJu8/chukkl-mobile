import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1126" />
      <View style={styles.header}>
        <Text style={styles.title}>Trustworthy Entertainment</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1126',
  },
  header: {
    backgroundColor: '#1a1126',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60, // Increased height
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    height: 30, // Adjusted height
  },
});

export default Header;
