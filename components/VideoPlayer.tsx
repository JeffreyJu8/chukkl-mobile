import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoPlayer = forwardRef(({ videoUrl, onMessage }: { videoUrl: string, onMessage: (event: any) => void }, ref) => {
  const webviewRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    injectJavaScript: (script: string) => {
      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(script);
      }
    }
  }));

  const getYoutubeVideoId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  const getYoutubeStartTime = (url: string): number => {
    const regex = /[?&]start=(\d+)/;
    const match = url.match(regex);
    return match ? parseInt(match[1], 10) : 0;
  };

  const videoId = getYoutubeVideoId(videoUrl);
  const startTime = getYoutubeStartTime(videoUrl);

  const injectedJavaScript = `
    (function() {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;
      window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
          videoId: '${videoId}',
          events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError,
            'onStateChange': onPlayerStateChange
          },
          playerVars: {
            'controls': 0,
            'autoplay': 1,
            'mute': 1,
            'disablekb': 1,
            'fs': 0,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'start': ${startTime}
          }
        });
      };

      function onPlayerReady(event) {
        event.target.playVideo();
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'onReady', muted: event.target.isMuted() }));
      }

      function onPlayerError(event) {
        document.getElementById('player').innerHTML = '<div style="color: white; text-align: center; margin-top: 20px;">An error occurred. Please try again later.</div>';
      }

      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'onPlaying', muted: event.target.isMuted() }));
        }
      }

      window.addEventListener('message', function(event) {
        var message = JSON.parse(event.data);
        if (message.event === 'mute') {
          player.mute();
          window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'mute', muted: true }));
        } else if (message.event === 'unmute') {
          player.unMute();
          window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'unmute', muted: false }));
        }
      });
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ html: `
          <html>
            <body style="margin:0;padding:0;overflow:hidden;">
              <div id="player" style="width:100vw;height:100vh;"></div>
              <script>${injectedJavaScript}</script>
            </body>
          </html>
        ` }}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={onMessage}
      />
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.touchBlocker} />
      </TouchableWithoutFeedback>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
  touchBlocker: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});

export default VideoPlayer;
