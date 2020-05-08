import {getRandomArrayItems} from '../utils/common.js';
import {getRandomBoolean} from '../utils/common.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import {EVENT_TYPES, CITIES, offersToType} from '../mock/const.js';

const getTypeGroups = (types) => {
  const groups = types.map((type) => type.group);
  return groups.filter((group, i) => {
    return groups.indexOf(group) === i;
  });
};

const getTypesMarkup = (group, types) => {
  const allTransferTypes = types.filter((type) => type.group === group);
  const uniqueTransferTypes = allTransferTypes.filter((type, i) => {
    return (allTransferTypes.indexOf(type) === i);
  });

  return uniqueTransferTypes
    .map((type) => {
      const typeString = (type.type.toLowerCase() === `check`) ? `check-in` : type.type.toLowerCase();
      const inputValue = (typeString !== `check-in`) ? typeString : `check`;
      return (
        `<div class="event__type-item">
          <input id="event-type-${typeString}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${inputValue}">
          <label class="event__type-label  event__type-label--${typeString}" for="event-type-${typeString}-1">${type.type}</label>
        </div>`
      );
    }).join(`\n`);
};

const getEventTypesListMarkup = (types) => {
  const typeGroups = getTypeGroups(types);
  return typeGroups.map((group) => {
    return (
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">${group}</legend>
        ${getTypesMarkup(group, types)}
      </fieldset>`
    );
  }).join(`\n`);
};

const getEventDestinationListMarkup = (cities) => {
  return cities.map((city) => {
    return `<option value="${city}"></option>`;
  }).join(`\n`);
};

const getOffersMarkup = (offers) => {
  return offers
    .map((offer) => {
      const checked = getRandomBoolean() ? `checked` : ``;
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${checked}>
          <label class="event__offer-label" for="event-offer-luggage-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const getDestinationPhotosMarkup = (photos) => {
  let markup = ``;
  for (let i = 0; i < photos; i++) {
    markup += `<img class="event__photo" src="http://picsum.photos/248/152?r=${Math.random()}" alt="Event photo">`;
  }
  return markup;
};

const getEventEditMarkup = (event) => {
  const eventType = (event.type.type !== `Check`) ? event.type.type : `Check-in`;

  const title = (event.type.group === `Activity`) ? `${eventType} in` : `${eventType} to`;

  const offersMarkup = getOffersMarkup(event.offers);
  const destinationPhotosMarkup = getDestinationPhotosMarkup(event.destinationInfo.photos);
  const isFavorite = event.isFavorite ? `checked` : ``;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="${eventType} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            ${getEventTypesListMarkup(EVENT_TYPES)}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${title}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${event.destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${getEventDestinationListMarkup(CITIES)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            ${event.price}&euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${event.destinationInfo.info.join(`. `)}.</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destinationPhotosMarkup}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

class Edit extends AbstractSmartComponent {
  constructor(event) {
    super();

    this._event = event;
    this._element = null;
    this._submitHandler = null;
    this._setCloseButtonClickHandler = null;
    this._setFavoritesButtonClickHandler = null;
    this._setTypeChoiceHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return getEventEditMarkup(this._event);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    // this._applyFlatpickr();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setCloseButtonClickHandler(handler) {
    const closeButton = this.getElement().querySelector(`.event__rollup-btn`);
    closeButton.addEventListener(`click`, handler);
    this._setCloseButtonClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);
    this._setFavoritesButtonClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelectorAll(`.event__type-input`).forEach((evtType) => {
      evtType.addEventListener(`change`, (evt) => {
        const type = evt.target.value;
        let newType = {};
        newType.type = type[0].toUpperCase() + type.slice(1);
        newType.group = EVENT_TYPES.filter((it) => it.type === newType.type)[0].group;
        this._event.type = newType;
        this._event.offers = getRandomArrayItems(offersToType[this._event.type.type], 3);
        this.rerender();
      });
    });
  }
}

export default Edit;
