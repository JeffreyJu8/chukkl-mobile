import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ChannelCard from '../../components/ChannelCard';
import ScheduleCard from '../../components/ScheduleCard';
import Footer from '../../components/Footer';
import useFetchChannels from '../../hooks/fetchChannels';
import { fetchScheduleDetailsForChannelAndDay } from '../../hooks/fetchSchedule';
import fetchCurrentVideoUrl from '../../hooks/fetchCurrentVideoUrl';
import VideoPlayer from '../../components/VideoPlayer';
import { Channel, RootStackParamList, Schedule } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment-timezone';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const { data: channels, loading, error } = useFetchChannels();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>('26');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const webviewRef = useRef<any>(null);
  const [schedules, setSchedules] = useState<{ [key: string]: Schedule[] }>({});
  const [scheduleLoading, setScheduleLoading] = useState<{ [key: string]: boolean }>({});
  const [scheduleError, setScheduleError] = useState<{ [key: string]: string | null }>({});

  const fetchInitialVideo = async (channelId: string = '26') => {
    try {
      const { url, endTime } = await fetchCurrentVideoUrl(channelId);
      setVideoUrl(url);
      setEndTime(endTime);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch the current video URL');
    }
  };

  useEffect(() => {
    fetchInitialVideo(selectedChannel);
  }, [selectedChannel]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      if (route.params?.videoUrl) {
        setVideoUrl(route.params.videoUrl);
        setCurrentTime(route.params.currentTime || 0);
        setEndTime(route.params.endTime || null);  // Handle undefined case
      } else {
        fetchInitialVideo(selectedChannel);
      }
    });

    return unsubscribeFocus;
  }, [navigation, route.params?.videoUrl]);

  useEffect(() => {
    if (endTime) {
      const interval = setInterval(() => {
        const currentTime = moment.tz(Intl.DateTimeFormat().resolvedOptions().timeZone);
        const videoEndTime = moment.tz(endTime, 'YYYY-MM-DD HH:mm:ss', Intl.DateTimeFormat().resolvedOptions().timeZone);
        if (currentTime.isSameOrAfter(videoEndTime)) {
          fetchInitialVideo(selectedChannel);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [endTime, selectedChannel]);

  const fetchSchedules = async () => {
    if (channels) {
      const dayOfWeek = moment().format('dddd');
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

  useEffect(() => {
    fetchSchedules();
  }, [channels]);

  const handleSelectChannel = async (channel: Channel) => {
    try {
      const { url, endTime } = await fetchCurrentVideoUrl(channel.channel_id);
      setVideoUrl(url);
      setEndTime(endTime);
      setSelectedChannel(channel.channel_id);  // Track the selected channel
      setMuted(true);
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
    if (videoUrl && endTime) {
      const currentTime = moment.tz(Intl.DateTimeFormat().resolvedOptions().timeZone);
      const videoEndTime = moment.tz(endTime, 'YYYY-MM-DD HH:mm:ss', Intl.DateTimeFormat().resolvedOptions().timeZone);
      const videoDuration = videoEndTime.diff(currentTime, 'seconds');
      navigation.navigate('VideoPlayer', { videoUrl, currentTime: videoDuration, endTime });
    } else {
      Alert.alert('Error', 'No video URL or end time available');
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
      <Header />
      <ScrollView style={styles.container}>
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
                <ScheduleCard
                  schedule={schedules[channel.channel_id]}
                />
              )}
            </View>
          </View>
        ))}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1126" />
      <Text style={styles.headerText}>
        <Text style={styles.highlight}>ch</Text>ukkl
      </Text>
      <Text style={styles.subHeaderText}>Safe Entertainment</Text>
    </View>
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
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#1a1126',
    paddingTop: StatusBar.currentHeight,
  },
  headerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Nunito_Medium',
    marginBottom: -10
  },
  subHeaderText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'NotoSans',
    marginBottom: 5
  },
});

export default HomeScreen;
