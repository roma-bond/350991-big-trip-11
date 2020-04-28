import {createElement} from "../utils/dom.js";

const getNoEventsMarkup = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

class NoEvents {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getNoEventsMarkup();
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

export default NoEvents;
