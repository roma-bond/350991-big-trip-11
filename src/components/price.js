import {createElements} from "../utils/dom.js";

const getPriceMarkup = (sum) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>`
  );
};

class Price {
  constructor() {
    this._element = null;
  }

  getTemplate(sum) {
    return getPriceMarkup(sum);
  }

  getElement(sum) {
    if (!this._element) {
      this._element = createElements(this.getTemplate(sum));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Price;
