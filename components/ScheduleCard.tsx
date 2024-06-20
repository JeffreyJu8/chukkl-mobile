import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Schedule } from '../app/(tabs)/types'; // Import Schedule type

interface ScheduleCardProps {
  schedule: Schedule[];
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  const [expanded, setExpanded] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
  const [timeLeft, setTimeLeft] = useState('');

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const updateCurrentSchedule = () => {
      if (!Array.isArray(schedule)) {
        console.error('Schedule is not an array:', schedule);
        return;
      }

      const now = new Date();
      const nowTime = now.getHours() * 60 + now.getMinutes();

      const current = schedule.find((item) => {
        const startTime = item.start_time.split(':');
        const endTime = item.end_time.split(':');
        const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
        const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
        return nowTime >= startMinutes && nowTime < endMinutes;
      });

      if (current) {
        setCurrentSchedule(current);
      } else {
        setCurrentSchedule(null);
      }
    };

    updateCurrentSchedule(); // Initial call to set the current schedule
    const intervalId = setInterval(updateCurrentSchedule, 60000); // Update every minute

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [schedule]);

  useEffect(() => {
    if (currentSchedule) {
      const updateRemainingTime = () => {
        const currentTime = new Date();
        const endTime = new Date();
        const [endHour, endMinute] = currentSchedule.end_time.split(':').map(Number);
        endTime.setHours(endHour);
        endTime.setMinutes(endMinute);
        const remainingTimeMs = endTime.getTime() - currentTime.getTime();
        const remainingHours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${remainingHours}hr ${remainingMinutes}min left`);
      };

      updateRemainingTime(); // Initial call to set the remaining time
      const intervalId = setInterval(updateRemainingTime, 5000); // Update every 5 seconds

      return () => clearInterval(intervalId); // Clear interval on component unmount
    } else {
      setTimeLeft('');
    }
  }, [currentSchedule]);

  return (
    <TouchableOpacity onPress={handleToggleExpand} style={[styles.card, expanded && styles.expandedCard]}>
      {currentSchedule ? (
        <>
          <Text style={styles.title}>{currentSchedule.title}</Text>
          <Text style={styles.timeLeft}>{timeLeft}</Text>
          {expanded && (
            <View>
              <Text style={styles.description}>{currentSchedule.description}</Text>
              <Text style={styles.time}>
                Start Time: {currentSchedule.start_time}
              </Text>
              <Text style={styles.time}>
                End Time: {currentSchedule.end_time}
              </Text>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.noCurrentSchedule}>No current schedule</Text>
      )}
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
    height: 150,
    borderWidth: 2,
    borderColor: '#8aefe7',
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
  time: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  noCurrentSchedule: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ScheduleCard;
