import {integerToMonth} from '../mock/const.js';
import {castTimeFormat} from '../utils/common.js';
import {SortType} from './sorting.js';
import AbstractComponent from "./abstract-component.js";


const getDayMarkup = (date, sortType) => {
  const day = castTimeFormat(date.getDate());
  const month = integerToMonth[castTimeFormat(date.getMonth() + 1)];
  const year = castTimeFormat(date.getFullYear());

  const dayInfoMarkup = (sortType !== SortType.DEFAULT) ? `` :
    `<span class="day__counter">${day}</span>
    <time class="day__date" datetime="${year}-${month}-${day}">${month.toUpperCase()} ${year.slice(2)}</time>`;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfoMarkup}
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

class Day extends AbstractComponent {
  constructor(date, sortType) {
    super();

    this._date = date;
    this._sortType = sortType;
    this._element = null;
  }

  getTemplate() {
    return getDayMarkup(this._date, this._sortType);
  }
}

export default Day;
