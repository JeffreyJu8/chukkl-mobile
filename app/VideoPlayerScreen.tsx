import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './(tabs)/types'; 
import { useNavigation } from '@react-navigation/native';
import VideoPlayer from '../components/VideoPlayer';
import * as ScreenOrientation from 'expo-screen-orientation';
import { FontAwesome } from '@expo/vector-icons';

type Props = StackScreenProps<RootStackParamList, 'VideoPlayer'>;

const VideoPlayerScreen: React.FC<Props> = ({ route }) => {
  const { videoUrl, currentTime, endTime, selectedChannel } = route.params;
  const navigation = useNavigation<Props['navigation']>();
  const [muted, setMuted] = useState(false);
  const webviewRef = useRef<any>(null);

  useEffect(() => {
    // Lock screen to landscape orientation when the video player screen is opened
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      // Unlock screen orientation when the video player screen is closed
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    if (webviewRef.current && currentTime !== undefined) {
      webviewRef.current.injectJavaScript(`
        window.postMessage(JSON.stringify({ event: 'seekTo', time: ${currentTime} }), '*');
      `);
    }
  }, [currentTime]);

  const toggleMute = () => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        window.postMessage(JSON.stringify({ event: '${muted ? 'unmute' : 'mute'}' }), '*');
      `);
      setMuted(!muted);
    }
  };

  const goBack = () => {
    console.log(`Returning to home with channel: ${selectedChannel}`);
    navigation.navigate('Home', { 
      selectedChannel
    });
  };

  const handleBackMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.event === 'currentTime') {
      console.log(`Returning to home with channel: ${selectedChannel}`);
      navigation.navigate('Home', { 
        videoUrl, 
        currentTime: data.currentTime, 
        endTime,
        selectedChannel
      });
    }
  };

  return (
    <View style={styles.container}>
      <VideoPlayer videoUrl={videoUrl} onMessage={handleBackMessage} ref={webviewRef} />
      <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
        <FontAwesome name={muted ? 'volume-off' : 'volume-up'} size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  muteButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
});

export default VideoPlayerScreen;
