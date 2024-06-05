// app/VideoPlayerScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import YouTube from 'react-native-youtube';
import { VideoPlayerScreenProps } from './(tabs)/types';
import { useNavigation } from '@react-navigation/native';

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ route }) => {
  const { channelId, videoUrl } = route.params;
  const navigation = useNavigation();
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState('');
  const [quality, setQuality] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const urlParams = new URLSearchParams(new URL(videoUrl).search);
        const id = urlParams.get('v');
        if (id) {
          setVideoId(id);
        } else {
          Alert.alert('Error', 'Invalid video URL');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch video URL');
      }
    };

    fetchVideo();
  }, [videoUrl]);

  const handleReady = () => {
    setIsReady(true);
  };

  const handleChangeState = (e: any) => {
    setStatus(e.state);
  };

  const handleChangeQuality = (e: any) => {
    setQuality(e.quality);
  };

  const handleError = (e: any) => {
    setError(e.error);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.videoContainer}>
        {videoId ? (
          <YouTube
            apiKey="YOUR_YOUTUBE_API_KEY" // required
            videoId={videoId}   // The YouTube video ID
            play={true}             // control playback of video with true/false
            fullscreen={false}       // control whether the video should play in fullscreen or inline
            loop={false}             // control whether the video should loop when ended

            onReady={handleReady}
            onChangeState={handleChangeState as () => void}
            onChangeQuality={handleChangeQuality as () => void}
            onError={handleError as () => void}

            style={{ alignSelf: 'stretch', height: 300 }}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  videoContainer: {
    flex: 1, 
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayerScreen;
