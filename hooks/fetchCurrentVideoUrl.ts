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

  // Assume startTime is in HH:mm:ss format and combine it with the current date
  const currentDate = moment().format('YYYY-MM-DD');
  const scheduledStartTimeString = `${currentDate} ${data.startTime}`;
  const scheduledStartTime = moment.tz(scheduledStartTimeString, userTimeZone);
  const currentTime = moment.tz(userTimeZone);
  const timeElapsed = currentTime.diff(scheduledStartTime, 'seconds');
  
  // Ensure initialStartTime is a valid number
  const initialStartTime = parseInt(extractStartTime(data.embedUrl), 10);
  const validStartTime = isNaN(initialStartTime) ? 0 : initialStartTime;

  const startTimes = validStartTime + timeElapsed;

  // Correct the URL by replacing start=NaN with the valid start time
  const correctedUrl = correctStartParameter(data.embedUrl, startTimes);

  // Print the URL to the console
  console.log(`Fetched video URL: ${correctedUrl}`);

  return correctedUrl;
};

const extractStartTime = (url: string): string => {
  const regex = /[?&]start=(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : '0';
};

const correctStartParameter = (url: string, validStartTime: number): string => {
  let startTimeFound = false;
  const params = url.split('&').map(param => {
    if (param.includes('start=NaN')) {
      if (startTimeFound) {
        param = `start=${validStartTime}`;
      } else {
        param = param.replace('start=NaN', `start=${validStartTime}`);
        startTimeFound = true;
      }
    } else if (param.includes('start=')) {
      startTimeFound = true;
    }
    return param;
  });

  return params.join('&');
};

export default fetchCurrentVideoUrl;
