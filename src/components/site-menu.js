import AbstractComponent from "./abstract-component.js";

const MenuItem = {
  TABLE: 0,
  STATISTICS: 1
};

const getMenuMarkup = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

class SiteMenu extends AbstractComponent {
  constructor() {
    super();

    this._displayModeButtons = Array.from(this.getElement().querySelectorAll(`.trip-tabs__btn`));
  }

  getTemplate() {
    return getMenuMarkup();
  }

  setActiveItem(menuItem) {
    this._displayModeButtons.forEach((el) => el.classList.remove(`trip-tabs__btn--active`));
    this._displayModeButtons[menuItem].classList.add(`trip-tabs__btn--active`);
  }

  getCurrentMode() {
    return;
  }

  setOnModeChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = this._displayModeButtons.findIndex((el) => {
        return el === evt.target;
      });
      handler(menuItem);
    });
  }
}

export default SiteMenu;
export {MenuItem};
