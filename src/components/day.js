import {integerToMonth} from '../mock/const.js';
import {castTimeFormat} from '../utils/common.js';
import AbstractComponent from "./abstract-component.js";


const getDayMarkup = (date) => {
  const day = castTimeFormat(date.getDate());
  const month = integerToMonth[castTimeFormat(date.getMonth() + 1)];
  const year = castTimeFormat(date.getFullYear());

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${year}-${month}-${day}">${month.toUpperCase()} ${year.slice(2)}</time>
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

class Day extends AbstractComponent {
  constructor(date) {
    super();

    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return getDayMarkup(this._date);
  }
}

export default Day;
