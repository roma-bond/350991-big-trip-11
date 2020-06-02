import AbstractComponent from "./abstract-component.js";
import {FilterType} from "../mock/const.js";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const getFiltersMarkup = (activeFilter) => {
  const filterMarkup = Object.values(FilterType).reduce((markup, type) => {
    const isChecked = (type === activeFilter) ? `checked` : ``;
    return `${markup}
      <div class="trip-filters__filter">
        <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked}>
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
      </div>
    `;
  }, ``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

class Filters extends AbstractComponent {
  constructor(activeFilter) {
    super();

    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return getFiltersMarkup(this._activeFilter);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}

export default Filters;
