// hooks/useFetchChannels.ts
import { useEffect, useState } from 'react';
import API_BASE_URL from '../constants/api';
import { Channel } from '../app/(tabs)/types';

interface FetchData {
  data: Channel[] | null;
  loading: boolean;
  error: boolean;
}

const getCurrentDayOfWeek = () => {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
};

const useFetchChannels = (): FetchData => {
  const [data, setData] = useState<Channel[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchChannels = async () => {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const dayOfWeek = getCurrentDayOfWeek();

      try {
        const response = await fetch(
          `${API_BASE_URL}/channels/dayoftheweek/${dayOfWeek}?timezone=${encodeURIComponent(userTimeZone)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const channels: Channel[] = await response.json();
        const limitedChannels = channels.slice(25, 50);
        setData(limitedChannels);
      } catch (error) {
        console.error('Error fetching channels:', error); // Enhanced logging
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return { data, loading, error };
};

export default useFetchChannels;
