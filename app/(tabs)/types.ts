// app/types.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// types.ts
export type RootStackParamList = {
  Home: { videoUrl?: string; currentTime?: number; endTime?: string };
  VideoPlayer: { videoUrl: string; currentTime?: number; endTime?: string };
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
  schedule_id: string;
  video_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  channel_id: string;
  maturity_rating: string;
}
