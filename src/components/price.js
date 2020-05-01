import AbstractComponent from "./abstract-component.js";

const getPriceMarkup = (sum) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>`
  );
};

class Price extends AbstractComponent {
  constructor(sum) {
    super();

    this._sum = sum;
    this._element = null;
  }

  getTemplate() {
    return getPriceMarkup(this._sum);
  }
}

export default Price;
