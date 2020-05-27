import AbstractSmartComponent from "./abstract-smart-component.js";
import {getRandomBoolean, getRandomArrayItems} from "../utils/common.js";
import {EVENT_TYPES, CITIES, offersToType} from "../mock/const.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DefaultText = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

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
    .map((offer, i) => {
      const idCount = i + 1;
      const checked = getRandomBoolean() ? `checked` : ``;
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${idCount}" type="checkbox" name="event-offer-luggage" ${checked}>
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
  return photos.reduce((markup, photo) => markup + `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`, ``);
};

const getEventEditMarkup = (event, externalData) => {
  const eventType = (event.type.type !== `Check`) ? event.type.type : `Check-in`;

  const title = (event.type.group === `Activity`) ? `${eventType} in` : `${eventType} to`;

  const offersMarkup = getOffersMarkup(event.offers);
  const destinationPhotosMarkup = getDestinationPhotosMarkup(event.destinationInfo.photos);
  const isFavorite = event.isFavorite ? `checked` : ``;
  const destinationList = getEventDestinationListMarkup(CITIES);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${event.destination}" list="destination-list-1" required>
          <datalist id="destination-list-1">
            ${destinationList}
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" step="0.01" value="${event.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

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
          <p class="event__destination-description">${event.destinationInfo.info}.</p>

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
    this._externalData = DefaultText;
    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._submitHandler = null;
    this._setCloseButtonClickHandler = null;
    this._setTypeChoiceHandler = null;
    this._deleteButtonClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  removeElement() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }

    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    super.removeElement();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  getTemplate() {
    return getEventEditMarkup(this._event, this._externalData);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setData(value) {
    this._externalData = Object.assign({}, DefaultText, value);
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setCloseButtonClickHandler(handler) {
    const closeButtonElement = this.getElement().querySelector(`.event__rollup-btn`);
    closeButtonElement.addEventListener(`click`, handler);
    this._setCloseButtonClickHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickrStart || this._flatpickrEnd) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    const dateStartElement = this.getElement().querySelector(`#event-start-time-1`);
    this._flatpickrStart = flatpickr(dateStartElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
      defaultDate: this._event.time.start,
    });

    const dateEndElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickrEnd = flatpickr(dateEndElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
      defaultDate: this._event.time.end,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const priceElement = element.querySelector(`.event__input--price`);
    const destinationElement = element.querySelector(`.event__input--destination`);

    element.querySelectorAll(`.event__type-input`).forEach((evtType) => {
      evtType.addEventListener(`change`, (evt) => {
        const type = evt.target.value;
        const newType = {};
        newType.type = type[0].toUpperCase() + type.slice(1);
        newType.group = EVENT_TYPES.filter((it) => it.type === newType.type)[0].group;
        this._event.type = newType;
        this._event.offers = getRandomArrayItems(offersToType[this._event.type.type], 3);
        this.rerender();
      });
    });

    destinationElement.addEventListener(`input`, (evt) => {
      evt.target.setCustomValidity(`Please choose a city from the list`);
      if (CITIES.includes(evt.target.value)) {
        evt.target.setCustomValidity(``);
      }
    });

    priceElement.addEventListener(`change`, (evt) => {
      const price = parseFloat(evt.target.value);
      evt.target.setCustomValidity(`Please specify some number`);
      if (!isNaN(price)) {
        priceElement.setCustomValidity(``);
      }
    });
  }
}

export default Edit;
