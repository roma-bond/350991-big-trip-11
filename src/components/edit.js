import AbstractSmartComponent from "./abstract-smart-component.js";
import {Mode} from "../controllers/point-controller.js";
import {EVENT_TYPES} from "../mock/const.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DefaultText = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const NewEventText = {
  deleteButtonText: `Cancel`
};

const getTypeGroups = (types) => {
  const groups = types.map((type) => type.group);
  return groups.filter((group, i) => {
    return groups.indexOf(group) === i;
  });
};

const getTypesMarkup = (group, types, checkedType) => {
  const allTransferTypes = types.filter((type) => type.group === group);
  const uniqueTransferTypes = allTransferTypes.filter((type, i) => {
    return (allTransferTypes.indexOf(type) === i);
  });

  return uniqueTransferTypes
    .map((type) => {
      const typeString = (type.type.toLowerCase() === `check`) ? `check-in` : type.type.toLowerCase();
      const inputValue = (typeString !== `check-in`) ? typeString : `check`;
      const checked = (typeString === checkedType) ? `checked` : ``;
      return (
        `<div class="event__type-item">
          <input id="event-type-${typeString}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${inputValue}" ${checked}>
          <label class="event__type-label  event__type-label--${typeString}" for="event-type-${typeString}-1">${type.type}</label>
        </div>`
      );
    }).join(`\n`);
};

const getEventTypesListMarkup = (types, checkedType) => {
  const typeGroups = getTypeGroups(types);
  return typeGroups.map((group) => {
    return (
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">${group}</legend>
        ${getTypesMarkup(group, types, checkedType)}
      </fieldset>`
    );
  }).join(`\n`);
};

const getEventDestinationListMarkup = (cities) => {
  return cities.map((city) => {
    return `<option value="${city}"></option>`;
  }).join(`\n`);
};

const getOffersMarkup = (allOffers, chosenOffers) => {
  const titlesOfUserOffers = chosenOffers.map((userOffer) => userOffer.title);
  const offersMarkup = allOffers
    .map((offer, i) => {
      const idCount = i + 1;
      const checked = titlesOfUserOffers.includes(offer.title) ? `checked` : ``;
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${idCount}" type="checkbox" name="event-offer-luggage" ${checked}>
          <label class="event__offer-label" for="event-offer-luggage-${idCount}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersMarkup}
      </div>
    </section>`
  );
};

const getDestinationPhotosMarkup = (photos) => {
  return photos.reduce((markup, photo) => markup + `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`, ``);
};

const getFavoriteMarkup = (isFavorite) => {
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const getCloseButtonMarkup = () => {
  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const getDestinationMarkup = (eventInfo, photosMarkup) => {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${eventInfo}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosMarkup}
        </div>
      </div>
    </section>`
  );
};

const getEventEditMarkup = (event, mode, externalData, destinations, offers) => {
  const eventType = (event.type.type !== `Check`) ? event.type.type : `Check-in`;
  const title = (event.type.group === `Activity`) ? `${eventType} in` : `${eventType} to`;

  const imageSrc = `img/icons/${eventType.toLowerCase()}.png`;

  const destinationList = getEventDestinationListMarkup(destinations.map((destination) => destination.name));
  let currentDestination = ``;
  let eventInfo = ``;
  let destinationPhotosMarkup = ``;
  let destinationMarkup = ``;

  const possibleOffers = offers.slice().find((offer) => {
    return offer.type === event.type.type.toLowerCase();
  });
  const offersMarkup = possibleOffers ? getOffersMarkup(possibleOffers.offers, event.offers) : ``;

  const isFavorite = event.isFavorite ? `checked` : ``;
  const favoriteMarkup = (mode === Mode.ADDING) ? `` : getFavoriteMarkup(isFavorite);
  const deleteButtonText = (mode === Mode.ADDING) ? NewEventText.deleteButtonText : externalData.deleteButtonText;

  const saveButtonText = externalData.saveButtonText;
  const closeButtonMarkup = (mode === Mode.ADDING) ? `` : getCloseButtonMarkup();

  if (event.destination) {
    currentDestination = destinations.find((destination) => {
      return destination.name === event.destination;
    });
    eventInfo = currentDestination ? currentDestination.description : ``;
    destinationPhotosMarkup = (currentDestination && currentDestination.pictures) ? getDestinationPhotosMarkup(currentDestination.pictures) : ``;
    destinationMarkup = getDestinationMarkup(eventInfo, destinationPhotosMarkup);
  }

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src=${imageSrc} alt="${eventType} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            ${getEventTypesListMarkup(EVENT_TYPES, event.type.type)}
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

        ${favoriteMarkup}

        ${closeButtonMarkup}
      </header>
      <section class="event__details">
        ${offersMarkup}
        ${destinationMarkup}
      </section>
    </form>`
  );
};

class Edit extends AbstractSmartComponent {
  constructor(event, mode, destinations, offers) {
    super();

    this._event = event;
    this._mode = mode;
    this._destinations = destinations;
    this._offers = offers;
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

  getTemplate() {
    return getEventEditMarkup(this._event, this._mode, this._externalData, this._destinations, this._offers);
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
    const formData = this._parseSubmitData();
    super.rerender();
    const {timeStart, timeEnd} = this._restoreSubmitData(formData);
    this._applyFlatpickr(timeStart, timeEnd);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  setDeleteButtonClickHandler(handler) {
    this._element.querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setData(value) {
    this._externalData = Object.assign({}, DefaultText, value);
    this.rerender();
  }

  setSubmitHandler(handler) {
    this._element.addEventListener(`submit`, handler);
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
      defaultDate: this._event.time.start || `today`,
      onChange: (selectedDates) => {
        if (this._flatpickrEnd.config._minDate < selectedDates[0]) {
          this._flatpickrEnd.setDate(selectedDates[0], false, `d/m/Y H:i`);
        }
        this._flatpickrEnd.set(`minDate`, selectedDates[0]);
      }
    });

    const dateEndElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickrEnd = flatpickr(dateEndElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
      defaultDate: this._event.time.end || `today`,
      minDate: this._event.time.start || `today`
    });
  }

  _parseSubmitData() {
    return {
      price: this._element.querySelector(`.event__input--price`).value,
      destination: this._element.querySelector(`.event__input--destination`).value,
      timeStart: new Date(this._element.querySelectorAll(`.event__input--time`)[0].value),
      timeEnd: new Date(this._element.querySelectorAll(`.event__input--time`)[2].value),
      isFavorite: (this._element.querySelector(`.event__favorite-checkbox`)) ? this._element.querySelector(`.event__favorite-checkbox`).checked : false,
      offers: this._event.offers
    };
  }

  _restoreSubmitData(formData) {
    const {price, destination, timeStart, timeEnd, isFavorite} = formData;
    this._element.querySelector(`.event__input--price`).value = price;
    this._element.querySelector(`.event__input--destination`).value = destination;
    if (this._element.querySelector(`.event__favorite-checkbox`)) {
      this._element.querySelector(`.event__favorite-checkbox`).checked = isFavorite;
    }
    return {timeStart, timeEnd};
  }

  _subscribeOnEvents() {
    const priceElement = this._element.querySelector(`.event__input--price`);
    const destinationElement = this._element.querySelector(`.event__input--destination`);
    let destinationsElement = this._destinations.map((destination) => destination.name);
    const offersSectionElement = this._element.querySelector(`.event__section--offers`);

    this._element.querySelectorAll(`.event__type-input`).forEach((evtType) => {
      evtType.addEventListener(`change`, (evt) => {
        const type = evt.target.value;
        const newType = {};
        newType.type = type[0].toUpperCase() + type.slice(1);
        newType.group = EVENT_TYPES.filter((eventType) => eventType.type === newType.type)[0].group;
        this._event.type = newType;
        this.rerender();
      });
    });

    destinationElement.addEventListener(`input`, (evt) => {
      evt.target.setCustomValidity(`Please choose a city from the list`);
      if (destinationsElement.includes(evt.target.value)) {
        this._event.destination = evt.target.value;
        this._event.destinationInfo.info = this._destinations.find((destination) => destination.name === this._event.destination).description;
        evt.target.setCustomValidity(``);
        this.rerender();
      }
    });

    priceElement.addEventListener(`change`, (evt) => {
      const price = parseFloat(evt.target.value);
      evt.target.setCustomValidity(`Please specify some number`);
      if (!isNaN(price)) {
        priceElement.setCustomValidity(``);
      }
    });

    if (offersSectionElement) {
      const offerElements = offersSectionElement.querySelectorAll(`.event__offer-checkbox`);
      Array.from(offerElements).forEach((offerElement) => {
        offerElement.addEventListener(`click`, (evt) => {
          const offerTitle = evt.target.nextElementSibling.children[0].innerText;
          const offerPrice = parseFloat(evt.target.nextElementSibling.children[1].innerText);

          if (evt.target.checked) {
            this._event.offers.push({title: offerTitle,
              price: offerPrice});
          } else {
            const index = this._event.offers.findIndex((offer) => offer.title === offerTitle);
            this._event.offers.splice(index, 1);
          }
        });
      });
    }
  }
}

export default Edit;
