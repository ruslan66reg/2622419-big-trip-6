import dayjs from 'dayjs';

const humanizePointDate = (date) => dayjs(date).format('MMM DD');

const humanizePointTime = (date) => dayjs(date).format('HH:mm');

const humanizeFormDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const getPointDuration = (dateFrom, dateTo) => {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  const days = Math.floor(timeDiff / 1440);
  const hours = Math.floor((timeDiff % 1440) / 60);
  const minutes = timeDiff % 60;

  if (days > 0) {
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
  return `${minutes.toString().padStart(2, '0')}M`;
};

export {humanizePointDate, humanizePointTime, humanizeFormDate, getPointDuration};
