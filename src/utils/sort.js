// Сортировка по цене (по убыванию)
const sortPointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

// Сортировка по времени (продолжительности) (по убыванию)
const sortPointByTime = (pointA, pointB) => {
  const timeA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const timeB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);
  return timeB - timeA;
};

// Сортировка по дате (по возрастанию)
const sortPointByDay = (pointA, pointB) => new Date(pointA.dateFrom) - new Date(pointB.dateFrom);

export {sortPointByPrice, sortPointByTime, sortPointByDay};
