// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ChannelCard from '../../components/ChannelCard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useFetchChannels from '../../hooks/fetchChannels';
import fetchCurrentVideoUrl from '../../hooks/fetchCurrentVideoUrl';
import { RootStackParamList, Channel } from './types';
import VideoPlayerScreen from '../VideoPlayerScreen';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { data: channels, loading, error } = useFetchChannels();

  const handleSelectChannel = async (channel: Channel) => {
    try {
      const url = await fetchCurrentVideoUrl(channel.channel_id);
      navigation.navigate('VideoPlayer', { channelId: channel.channel_id, videoUrl: url });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch the current video URL');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !channels) {
    return (
      <View style={styles.error}>
        <Text>Error loading channels</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      {channels.map((channel) => (
        <ChannelCard
          key={channel.channel_id}
          channel={channel}
          onSelect={() => handleSelectChannel(channel)}
        />
      ))}
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Stack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
