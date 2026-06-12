import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeFormDate} from '../utils/date.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';
import {getOffersByType} from '../model/points-model.js';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

function createEventTypesTemplate(currentType, pointId, isDisabled) {
  return EVENT_TYPES.map((type) => {
    const isChecked = type === currentType ? 'checked' : '';
    const disabledState = isDisabled ? 'disabled' : '';
    return `
      <div class="event__type-item">
        <input id="event-type-${type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked} ${disabledState}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${pointId}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
      </div>
    `;
  }).join('');
}

function createOffersTemplate(offers, selectedOffers, isDisabled) {
  if (!offers || offers.length === 0) {
    return '';
  }

  const offersMarkup = offers.map((offer) => {
    const isChecked = selectedOffers.includes(offer.id) ? 'checked' : '';
    const disabledState = isDisabled ? 'disabled' : '';
    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" data-offer-id="${offer.id}" ${isChecked} ${disabledState}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${he.encode(offer.title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${he.encode(String(offer.price))}</span>
        </label>
      </div>`;
  }).join('');

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersMarkup}
      </div>
    </section>
  `;
}

function createDestinationTemplate(destination) {
  if (!destination || (!destination.description && (!destination.pictures || destination.pictures.length === 0))) {
    return '';
  }

  const descriptionMarkup = destination.description ? `<p class="event__destination-description">${he.encode(destination.description)}</p>` : '';
  const picturesMarkup = destination.pictures && destination.pictures.length > 0
    ? `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map((picture) => `<img class="event__photo" src="${he.encode(picture.src)}" alt="${he.encode(picture.description)}">`).join('')}
        </div>
      </div>`
    : '';

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${descriptionMarkup}
      ${picturesMarkup}
    </section>
  `;
}

function createEventEditTemplate(state, allDestinations, allOffers) {
  const {id, type, basePrice, destination, dateFrom, dateTo, offers, isDisabled, isSaving, isDeleting} = state;
  const pointId = id || 'new';

  const currentDestination = allDestinations.find((destinationItem) => destinationItem.id === destination);
  const currentTypeOffers = getOffersByType(allOffers, type)?.offers || [];
  const destinationOptions = allDestinations.map((destinationItem) => `<option value="${he.encode(destinationItem.name)}"></option>`).join('');

  let isSubmitDisabled = isDisabled || !dateFrom || !dateTo || !destination;
  if (basePrice === null || basePrice === undefined || basePrice === '') {
    isSubmitDisabled = true;
  }

  let deleteCancelText = 'Delete';
  if (!id) {
    deleteCancelText = 'Cancel';
  } else if (isDeleting) {
    deleteCancelText = 'Deleting...';
  }

  const startTimeValue = dateFrom ? humanizeFormDate(dateFrom) : '';
  const endTimeValue = dateTo ? humanizeFormDate(dateTo) : '';
  const disabledState = isDisabled ? 'disabled' : '';
  const priceValue = basePrice !== null && basePrice !== undefined ? basePrice : '';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox" ${disabledState}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypesTemplate(type, pointId, isDisabled)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${pointId}">${type}</label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${currentDestination ? he.encode(currentDestination.name) : ''}" list="destination-list-${pointId}" ${disabledState} autocomplete="off">
            <datalist id="destination-list-${pointId}">
              ${destinationOptions}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${startTimeValue}" ${disabledState}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${endTimeValue}" ${disabledState}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${priceValue}" ${disabledState}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>

          <button class="event__reset-btn" type="reset">
            ${deleteCancelText}
          </button>

          ${id ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
        </header>

        <section class="event__details">
          ${createOffersTemplate(currentTypeOffers, offers, isDisabled)}
          ${createDestinationTemplate(currentDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class EventEditView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleDeleteClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point, destinations, offers, onFormSubmit, onRollupClick, onDeleteClick}) {
    super();
    this._setState(EventEditView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      EventEditView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    const offersContainer = this.element.querySelector('.event__available-offers');
    if (offersContainer) {
      offersContainer.addEventListener('change', this.#offerChangeHandler);
    }

    const rollupButton = this.element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler);
    }

    this.#setDatepickers();
  }

  #setDatepickers() {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }

    const startTimeElement = this.element.querySelector('[name="event-start-time"]');
    const endTimeElement = this.element.querySelector('[name="event-end-time"]');

    if (startTimeElement) {
      const config = {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        onChange: this.#dateFromChangeHandler,
      };
      if (this._state.dateFrom) {
        config.defaultDate = this._state.dateFrom;
      }
      this.#datepickerFrom = flatpickr(startTimeElement, config);
    }

    if (endTimeElement) {
      const config = {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minDate: this._state.dateFrom || null,
        onChange: this.#dateToChangeHandler,
      };
      if (this._state.dateTo) {
        config.defaultDate = this._state.dateTo;
      }
      this.#datepickerTo = flatpickr(endTimeElement, config);
    }
  }

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#checkSubmitButtonValidity();
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
    this.#checkSubmitButtonValidity();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#destinations.find((destinationItem) => destinationItem.name === evt.target.value);

    if (!selectedDestination) {
      evt.target.value = '';
      this.updateElement({
        destination: ''
      });
      return;
    }

    this.updateElement({
      destination: selectedDestination.id,
    });
  };

  #offerChangeHandler = (evt) => {
    if (evt.target.classList.contains('event__offer-checkbox')) {
      const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
      this._setState({
        offers: checkedBoxes.map((box) => box.dataset.offerId)
      });
    }
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    evt.target.value = evt.target.value.replace(/\D/g, '');
    this._setState({
      basePrice: parseInt(evt.target.value, 10) || 0,
    });
    this.#checkSubmitButtonValidity();
  };

  #checkSubmitButtonValidity() {
    const submitButton = this.element.querySelector('.event__save-btn');
    let isSubmitDisabled = !this._state.dateFrom || !this._state.dateTo || !this._state.destination;
    if (this._state.basePrice === null || this._state.basePrice === undefined || this._state.basePrice === '') {
      isSubmitDisabled = true;
    }
    submitButton.disabled = isSubmitDisabled;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EventEditView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventEditView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    const isNewPoint = !point.id;
    return {...point,
      dateFrom: isNewPoint ? '' : (point.dateFrom || ''),
      dateTo: isNewPoint ? '' : (point.dateTo || ''),
      basePrice: isNewPoint ? 0 : (point.basePrice || 0),
      offers: point.offers || [],
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}
