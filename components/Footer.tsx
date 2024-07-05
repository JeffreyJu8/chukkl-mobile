import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2024 Chukkl</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    backgroundColor: '#1a1126',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#fff'
  },
});

export default Footer;
