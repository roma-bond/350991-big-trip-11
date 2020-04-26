import {createElements} from "../utils/dom.js";

const getMenuMarkup = () => {
  return (
    `<h2 class="visually-hidden">Switch trip view</h2>
    <!-- Меню -->
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

class SiteMenu {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getMenuMarkup();
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

export default SiteMenu;
