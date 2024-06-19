import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ChannelCard from '../../components/ChannelCard';
import ScheduleCard from '../../components/ScheduleCard'; // Import ScheduleCard
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useFetchChannels from '../../hooks/fetchChannels';
import { fetchScheduleDetailsForChannelAndDay } from '../../hooks/fetchSchedule'; // Import function
import fetchCurrentVideoUrl from '../../hooks/fetchCurrentVideoUrl';
import VideoPlayer from '../../components/VideoPlayer';
import { Channel, RootStackParamList } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment-timezone';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const { data: channels, loading, error } = useFetchChannels();
  const navigation = useNavigation();
  const route = useRoute<HomeScreenRouteProp>();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const webviewRef = useRef<any>(null);
  const [schedules, setSchedules] = useState<{ [key: string]: any[] }>({}); // State to hold schedules
  const [scheduleLoading, setScheduleLoading] = useState<{ [key: string]: boolean }>({});
  const [scheduleError, setScheduleError] = useState<{ [key: string]: string | null }>({});

  const fetchInitialVideo = async () => {
    try {
      const url = await fetchCurrentVideoUrl('1'); // Initial video URL, replace '1' with a valid channel ID if necessary
      setVideoUrl(url);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch the current video URL');
    }
  };

  useEffect(() => {
    fetchInitialVideo();
  }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // Refresh the video URL and channels data
      if (route.params?.videoUrl) {
        setVideoUrl(route.params.videoUrl);
      } else {
        fetchInitialVideo();
      }
    });

    return unsubscribeFocus;
  }, [navigation, route.params?.videoUrl]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (channels) {
        const dayOfWeek = moment().format('dddd'); // Get the current day of the week
        const schedulePromises = channels.map(async (channel) => {
          setScheduleLoading((prev) => ({ ...prev, [channel.channel_id]: true }));
          try {
            const schedule = await fetchScheduleDetailsForChannelAndDay(channel.channel_id, dayOfWeek);
            setSchedules((prev) => ({ ...prev, [channel.channel_id]: schedule }));
            setScheduleError((prev) => ({ ...prev, [channel.channel_id]: null }));
          } catch (error) {
            setScheduleError((prev) => ({ ...prev, [channel.channel_id]: 'Failed to fetch schedule' }));
          } finally {
            setScheduleLoading((prev) => ({ ...prev, [channel.channel_id]: false }));
          }
        });
        await Promise.all(schedulePromises);
      }
    };

    fetchSchedules();
  }, [channels]);

  const handleSelectChannel = async (channel: Channel) => {
    try {
      const url = await fetchCurrentVideoUrl(channel.channel_id);
      setVideoUrl(url);
      setMuted(true); // Reset mute state when switching videos
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch the current video URL');
    }
  };

  const toggleMute = () => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        window.postMessage(JSON.stringify({ event: '${muted ? 'unmute' : 'mute'}' }), '*');
      `);
      setMuted(!muted);
    }
  };

  const goToFullscreen = () => {
    if (videoUrl) {
      navigation.navigate('VideoPlayer', { videoUrl });
    } else {
      Alert.alert('Error', 'No video URL available');
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
        {videoUrl && (
          <View style={styles.videoPlayerContainer}>
            <VideoPlayer videoUrl={videoUrl} onMessage={() => {}} ref={webviewRef} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
                <FontAwesome name={muted ? 'volume-off' : 'volume-up'} size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.fullscreenButton} onPress={goToFullscreen}>
                <FontAwesome name="expand" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {channels.map((channel) => (
          <View key={channel.channel_id} style={styles.row}>
            <View style={styles.column}>
              <ChannelCard
                key={channel.channel_id}
                channel={channel}
                onSelect={() => handleSelectChannel(channel)}
              />
            </View>
            <View style={styles.column}>
              {scheduleLoading[channel.channel_id] && <Text>Loading schedule...</Text>}
              {scheduleError[channel.channel_id] && <Text>{scheduleError[channel.channel_id]}</Text>}
              {schedules[channel.channel_id] && !scheduleLoading[channel.channel_id] && !scheduleError[channel.channel_id] && (
                <ScheduleCard schedule={schedules[channel.channel_id][0]} />
              )}
            </View>
          </View>
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
  videoPlayerContainer: {
    height: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingRight: 10,
    color: '#fff',
  },
  muteButton: {
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  fullscreenButton: {
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default HomeScreen;
