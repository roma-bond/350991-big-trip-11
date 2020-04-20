import {integerToMonth} from '../mock/const.js';

const getDayMarkup = (date) => {
  const day = date.split(`/`)[0];
  const month = date.split(`/`)[1];
  const year = date.split(`/`)[2].slice(2);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="2019-03-18">${integerToMonth[month].toUpperCase()} ${year}</time>
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default getDayMarkup;
