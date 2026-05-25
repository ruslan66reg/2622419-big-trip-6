import dayjs from 'dayjs';
import {FilterType} from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,

  [FilterType.FUTURE]: (points) => points.filter((point) =>
    dayjs().isBefore(dayjs(point.dateFrom), 'D') || dayjs().isSame(dayjs(point.dateFrom), 'D')
  ),

  [FilterType.PRESENT]: (points) => points.filter((point) =>
    dayjs().isAfter(dayjs(point.dateFrom), 'D') && dayjs().isBefore(dayjs(point.dateTo), 'D')
  ),

  [FilterType.PAST]: (points) => points.filter((point) =>
    dayjs().isAfter(dayjs(point.dateTo), 'D') || dayjs().isSame(dayjs(point.dateTo), 'D')
  ),
};

export {filter};
