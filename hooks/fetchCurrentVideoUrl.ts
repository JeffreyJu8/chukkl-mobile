import API_BASE_URL from '../constants/api';
import moment from 'moment-timezone';

const fetchCurrentVideoUrl = async (channelId: string): Promise<{ url: string, endTime: string }> => {
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

  const currentDate = moment().format('YYYY-MM-DD');
  const scheduledStartTimeString = `${currentDate} ${data.startTime}`;
  const scheduledStartTime = moment.tz(scheduledStartTimeString, userTimeZone);
  const currentTime = moment.tz(userTimeZone);
  const timeElapsed = currentTime.diff(scheduledStartTime, 'seconds');
  
  const initialStartTime = parseInt(extractStartTime(data.embedUrl), 10);
  const validStartTime = isNaN(initialStartTime) ? 0 : initialStartTime;

  const startTimes = validStartTime + timeElapsed;

  let correctedUrl = correctStartParameter(data.embedUrl, startTimes);

  // Ensure the URL includes the mute=0 parameter and remove any duplicate mute parameters
  correctedUrl = correctMuteParameter(correctedUrl);

  const endTime = `${currentDate} ${data.endTime}`;  // Assuming endTime is in 'HH:mm:ss' format

  return { url: correctedUrl, endTime };
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

const correctMuteParameter = (url: string): string => {
  let muteParamFound = false;
  const params = url.split('&').map(param => {
    if (param.includes('mute=')) {
      if (muteParamFound) {
        return ''; // Remove duplicate mute parameter
      }
      muteParamFound = true;
      return 'mute=0'; // Ensure the mute parameter is set to 0 (unmuted)
    }
    return param;
  }).filter(param => param !== ''); // Remove empty strings

  if (!muteParamFound) {
    params.push('mute=0'); // Add mute=0 if not found
  }

  return params.join('&');
};

export default fetchCurrentVideoUrl;
