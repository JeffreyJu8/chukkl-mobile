// components/ChannelCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Channel } from '../app/(tabs)/types';

interface ChannelCardProps {
  channel: Channel;
  onSelect: () => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onSelect }) => {
  return (
    <TouchableOpacity onPress={onSelect} style={styles.card}>
      <Text style={styles.name}>{channel.name}</Text>
      <Text style={styles.bio}>{channel.bio}</Text>
      <Text style={styles.rating}>{channel.maturity_rating}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#373243',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  bio: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    fontSize: 12,
    color: '#999',
  },
});

export default ChannelCard;
