import {createElement} from "../utils/dom.js";

const getPriceMarkup = (sum) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>`
  );
};

class Price {
  constructor(sum) {
    this._sum = sum;
    this._element = null;
  }

  getTemplate() {
    return getPriceMarkup(this._sum);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(this._sum));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Price;
