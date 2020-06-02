import {integerToMonth} from '../mock/const.js';
import {castTimeFormat} from '../utils/common.js';
import {SortType} from './sorting.js';
import AbstractComponent from "./abstract-component.js";

const NUMBER_SHIFT = 1;
const MONTH_SHIFT = 1;

const getDayMarkup = (date, sortType, number) => {
  const day = castTimeFormat(date.getDate());
  const month = integerToMonth[castTimeFormat(date.getMonth() + MONTH_SHIFT)];
  const year = castTimeFormat(date.getFullYear());

  const dayInfoMarkup = (sortType !== SortType.DEFAULT) ? `` :
    `<span class="day__counter">${number}</span>
    <time class="day__date" datetime="${year}-${month}-${day}">${month.toUpperCase()} ${day}</time>`;

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
  constructor(date, sortType, index) {
    super();

    this._date = date;
    this._sortType = sortType;
    this._number = index + NUMBER_SHIFT;
    this._element = null;
  }

  getTemplate() {
    return getDayMarkup(this._date, this._sortType, this._number);
  }
}

export default Day;
