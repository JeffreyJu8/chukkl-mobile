// app/types.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: { videoUrl?: string };
  VideoPlayer: { videoUrl: string };
};

export type VideoPlayerScreenRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;
export type VideoPlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VideoPlayer'>;

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

export interface Schedule {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  maturity_rating: string;
}
