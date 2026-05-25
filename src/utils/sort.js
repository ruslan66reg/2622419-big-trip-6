const sortPointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortPointByTime = (pointA, pointB) => {
  const timeA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const timeB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);
  return timeB - timeA;
};

const sortPointByDay = (pointA, pointB) => new Date(pointA.dateFrom) - new Date(pointB.dateFrom);

export {sortPointByPrice, sortPointByTime, sortPointByDay};
