import DynamicFeed from '@mui/icons-material/DynamicFeed';

export const logo = 'https://i.ibb.co/s9Qys2j/logo.png';

export const categories = [
  { name: 'DailyFeeds', icon: <DynamicFeed />, },
  { name: 'Chuck Norris', icon: <DynamicFeed />, }

];

export const demoThumbnailUrl = 'https://i.ibb.co/G2L2Gwp/API-Course.png';
export const demoChannelUrl = '/channel/UCmXmlB4-HJytD7wek0Uo97A';
export const demoVideoUrl = '/video/GDa8kZLNhJ4';
export const demoChannelTitle = 'JavaScript Mastery';
export const demoVideoTitle = 'Build and Deploy 5 JavaScript & React API Projects in 10 Hours - Full Course | RapidAPI';
export const demoProfilePicture = 'http://dergipark.org.tr/assets/app/images/buddy_sample.png'

export const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const options = { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '') + ' ' .toLowerCase();
  return formattedDate;
};