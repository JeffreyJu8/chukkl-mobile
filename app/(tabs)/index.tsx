// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChannelCard from '../../components/ChannelCard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useFetchChannels from '../../hooks/fetchChannels';
import fetchCurrentVideoUrl from '../../hooks/fetchCurrentVideoUrl';
import { Channel, RootStackParamList } from './types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const { data: channels, loading, error } = useFetchChannels();
  const navigation = useNavigation<HomeScreenNavigationProp>();

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1126" />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1126',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1126',
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

export default HomeScreen;
