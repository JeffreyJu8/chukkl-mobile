import API_BASE_URL from '../constants/api';
import moment from 'moment-timezone';

const fetchCurrentVideoUrl = async (channelId: string): Promise<string> => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const response = await fetch(`${API_BASE_URL}/videos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channelId, timezone: userTimeZone }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  const scheduledStartTime = moment.tz(data.startTime, userTimeZone);
  const currentTime = moment.tz(userTimeZone);
  const timeElapsed = currentTime.diff(scheduledStartTime, 'seconds');
  const initialStartTime = parseInt(extractStartTime(data.embedUrl));
  const startTimes = initialStartTime + timeElapsed;

  // Adjust the video URL to include the start time
  const videoUrl = `${data.embedUrl}?start=${startTimes}`;

  return videoUrl;
};

const extractStartTime = (url: string): string => {
  const regex = /[?&]start=(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : '0';
};

export default fetchCurrentVideoUrl;
