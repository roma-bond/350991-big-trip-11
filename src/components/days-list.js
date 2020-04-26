import {createElements} from "../utils/dom.js";

const getDaysListMarkup = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

class DaysList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getDaysListMarkup();
  }

  getElement() {
    if (!this._element) {
      this._element = createElements(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default DaysList;
