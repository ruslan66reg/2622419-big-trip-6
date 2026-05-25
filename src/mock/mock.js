import {nanoid} from 'nanoid';

const mockDestinations = [
  { id: '1', description: 'Chamonix, is a beautiful city, a true asian pearl.', name: 'Chamonix', pictures: [{ src: 'https://loremflickr.com/248/152?random=1', description: 'Chamonix parliament building' }] },
  { id: '2', description: 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman.', name: 'Geneva', pictures: [{ src: 'https://loremflickr.com/248/152?random=2', description: 'Geneva lake' }] }
];

const mockOffers = [
  { type: 'taxi', offers: [{ id: '1', title: 'Order Uber', price: 20 }, { id: '2', title: 'Radio', price: 5 }] },
  { type: 'flight', offers: [{ id: '1', title: 'Add luggage', price: 50 }, { id: '2', title: 'Comfort class', price: 80 }] }
];

const mockPoints = [
  { id: '1', basePrice: 120, dateFrom: '2019-07-10T22:55:56.845Z', dateTo: '2019-07-11T11:22:13.375Z', destination: '1', isFavorite: false, offers: ['1', '2'], type: 'taxi' },
  { id: '2', basePrice: 800, dateFrom: '2019-07-11T22:55:56.845Z', dateTo: '2019-07-12T11:22:13.375Z', destination: '2', isFavorite: true, offers: ['1'], type: 'flight' }
];

export const getRandomPoint = () => {
  const randomPoint = mockPoints[Math.floor(Math.random() * mockPoints.length)];
  return {
    ...randomPoint,
    id: nanoid() 
  };
};

export const getMockDestinations = () => mockDestinations;
export const getMockOffers = () => mockOffers;
