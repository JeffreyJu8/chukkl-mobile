// components/VideoPlayer.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ uri: videoUrl }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayer;
