import {getRandomBoolean} from '../utils/common.js';
import {createElements} from "../utils/dom.js";
import {EVENT_TYPES, CITIES} from '../mock/const.js';

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
      return (
        `<div class="event__type-item">
          <input id="event-type-${type.type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.type.toLowerCase()}">
          <label class="event__type-label  event__type-label--${type.type.toLowerCase()}" for="event-type-${type.type.toLowerCase()}-1">${type.type}</label>
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
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
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

class Edit {
  constructor() {
    this._element = null;
  }

  getTemplate(event) {
    return getEventEditMarkup(event);
  }

  getElement(event) {
    if (!this._element) {
      this._element = createElements(this.getTemplate(event));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Edit;
