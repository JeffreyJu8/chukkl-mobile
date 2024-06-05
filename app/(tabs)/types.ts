// app/types.ts
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  VideoPlayer: { channelId: string; videoUrl: string };
};

export type VideoPlayerScreenRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;
export type VideoPlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoPlayer'>;

export interface VideoPlayerScreenProps {
  route: VideoPlayerScreenRouteProp;
  navigation: VideoPlayerScreenNavigationProp;
}

export interface Channel {
  channel_id: string;
  name: string;
  bio: string;
  maturity_rating: string;
}
