import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ScheduleCardProps {
  schedule: any;
  isCurrent: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, isCurrent }) => {
  const [expanded, setExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (isCurrent) {
      const updateRemainingTime = () => {
        const currentTime = new Date();
        const endTime = new Date(schedule.end_time);
        const remainingTimeMs = endTime.getTime() - currentTime.getTime();
        const remainingHours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${remainingHours}hr ${remainingMinutes}min left`);
      };

      updateRemainingTime(); // Initial call to set the remaining time
      const intervalId = setInterval(updateRemainingTime, 5000); // Update every 5 seconds

      return () => clearInterval(intervalId); // Clear interval on component unmount
    } else {
      const startTimeStr = new Date(schedule.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const endTimeStr = new Date(schedule.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      setTimeLeft(`${startTimeStr} - ${endTimeStr}`);
    }
  }, [isCurrent, schedule]);

  return (
    <TouchableOpacity onPress={handleToggleExpand} style={[styles.card, expanded && styles.expandedCard]}>
      <Text style={styles.title}>{schedule.title}</Text>
      <Text style={styles.timeLeft}>{timeLeft}</Text>
      {expanded && <Text style={styles.description}>{schedule.description}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#444054',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    flex: 1, 
    height: 100,
  },
  expandedCard: {
    height: 'auto',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeLeft: {
    fontSize: 14,
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
});

export default ScheduleCard;
