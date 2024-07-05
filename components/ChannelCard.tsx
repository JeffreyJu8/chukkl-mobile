import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Channel } from '../app/(tabs)/types';

interface ChannelCardProps {
  channel: Channel;
  onSelect: () => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={handleToggleExpand} style={[styles.card, expanded && styles.expandedCard]}>
      <Text style={styles.name}>{channel.name}</Text>
      <Text style={styles.rating}>{channel.maturity_rating}</Text>
      {expanded && <Text style={styles.bio}>{channel.bio}</Text>}
      {expanded && <TouchableOpacity onPress={onSelect}><Text style={styles.selectText}>Watch Now</Text></TouchableOpacity>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#000000',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    flex: 1, 
    height: 150,
    marginRight: 10,
    borderWidth: 2,         
    borderColor: '#8aefe7'
  },
  expandedCard: {
    height: 'auto',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'ComicNeue_Bold'
  },
  bio: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    fontSize: 12,
    color: '#999',
  },
  selectText: {
    marginTop: 10,
    color: '#8aefe7',
    fontWeight: 'bold',
  },
});

export default ChannelCard;
