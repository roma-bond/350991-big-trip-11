import {getDuration} from '../utils/common.js';
import {createElement} from "../utils/dom.js";

const getOffersMarkup = (offers) => {
  return offers
    .map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    })
    .join(`\n`);
};

const getEventMarkup = (event) => {
  const eventType = (event.type.type !== `Check`) ? event.type.type : `Check-in`;

  const title = (event.type.group === `Activity`) ? `${eventType} in ${event.destination}` : `${eventType} to ${event.destination}`;

  const offersMarkup = getOffersMarkup(event.offers);
  const startDate = event.time.start.toISOString();
  const startTime = event.time.start.toString().slice(16, 21);
  const endDate = event.time.end.toISOString();
  const endTime = event.time.end.toString().slice(16, 21);
  const duration = getDuration(event.time);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.toLowerCase()}.png" alt="${eventType} icon">
        </div>
        <h3 class="event__title">${title}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDate}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDate}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

class Event {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return getEventMarkup(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Event;
