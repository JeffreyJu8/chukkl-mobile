// hooks/fetchSchedule.ts
import { useState, useEffect } from 'react';
import API_BASE_URL from '../constants/api';

const useFetchSchedule = (channelId: string, dayOfWeek: string) => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/schedules?channelId=${channelId}&dayOfWeek=${dayOfWeek}`);
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }
        const data = await response.json();
        setSchedule(data);
      } catch (err) {
        setError('Failed to fetch schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [channelId, dayOfWeek]);

  return { schedule, loading, error };
};

export const fetchScheduleDetailsForChannelAndDay = async (channelId: string, dayOfWeek: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules?channelId=${channelId}&dayOfWeek=${dayOfWeek}`);
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching schedule details:', err);
    throw err;
  }

  
};

export default useFetchSchedule;
