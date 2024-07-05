import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
  const [loaded] = useFonts({
    NotoSans: require('../assets/fonts/NotoSans.ttf'),
    Rubik_Medium: require('../assets/fonts/Rubik-Medium.ttf'),
    Nunito_Medium: require('../assets/fonts/Nunito-Medium.ttf')
  });

  if (!loaded) {
    return null;
  }

  // return (
  //   <SafeAreaView style={styles.safeArea}>
  //     <View style={styles.headerContainer}>
  //       <StatusBar barStyle="light-content" backgroundColor="#1a1126" />
  //       <View style={styles.statusBarContent}>
  //         <Text style={styles.statusBarText}>
  //           <Text style={styles.highlight}>ch</Text>kkl
  //         </Text>
  //       </View>
  //       <View style={styles.headerContent}>
  //         <Text style={styles.headerText}>Safe Entertainment</Text>
  //       </View>
  //     </View>
  //   </SafeAreaView>
  // );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1a1126',
  },
  headerContainer: {
    backgroundColor: '#1a1126',
    justifyContent: 'center',
    width: '100%',
  },
  statusBarContent: {
    alignItems: 'center',
  },
  statusBarText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Nunito_Medium',
  },
  highlight: {
    color: '#8aefe7',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Rubik_Medium',
  },
});

export default Header;
