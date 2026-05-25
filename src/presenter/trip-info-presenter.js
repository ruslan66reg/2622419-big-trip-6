import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import {sortPointByDay} from '../utils/sort.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor({tripInfoContainer, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#pointsModel.points;
    const destinations = this.#pointsModel.destinations;
    const offers = this.#pointsModel.offers;

    if (points.length === 0 || destinations.length === 0 || offers.length === 0) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
      return;
    }

    const sortedPoints = [...points].sort(sortPointByDay);

    const route = this.#calculateRoute(sortedPoints, destinations);
    const dates = this.#calculateDates(sortedPoints);
    const price = this.#calculatePrice(sortedPoints, offers);

    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({route, dates, price});

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #calculateRoute(points, destinations) {
    const pointDestinations = points.map((point) => {
      const dest = destinations.find((d) => d.id === point.destination);
      return dest ? dest.name : '';
    });

    if (pointDestinations.length <= 3) {
      return pointDestinations.join(' &mdash; ');
    }

    return `${pointDestinations[0]} &mdash; ... &mdash; ${pointDestinations[pointDestinations.length - 1]}`;
  }

  #calculateDates(points) {
    const startDate = points[0].dateFrom;
    const endDate = points[points.length - 1].dateTo;

    const startFormat = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endFormat = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return `${startFormat}&nbsp;&mdash;&nbsp;${endFormat}`;
  }

  #calculatePrice(points, allOffers) {
    let total = 0;

    points.forEach((point) => {
      total += point.basePrice;

      const pointTypeOffers = allOffers.find((offer) => offer.type === point.type);
      if (pointTypeOffers) {
        point.offers.forEach((offerId) => {
          const selectedOffer = pointTypeOffers.offers.find((offer) => offer.id === offerId);
          if (selectedOffer) {
            total += selectedOffer.price;
          }
        });
      }
    });

    return total;
  }
}
