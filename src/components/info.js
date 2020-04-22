import {integerToMonth} from '../mock/const.js';
import {castTimeFormat} from '../utils/common.js';

const getRoute = (events) => {
  let cities = [];
  events.forEach((eventsGroup) => {
    eventsGroup.events.forEach((event) => {
      cities.push(event.destination);
    });
  });
  const route = cities.filter((city, i) => {
    return (((i > 0) && (city !== cities[i - 1])) || (i === 0));
  }).join(` &mdash; `);
  return route;
};

const getInfoMarkup = (sortedEvents) => {
  let sorted = sortedEvents.slice();
  const startDate = sorted[0].date;
  const startDay = startDate.getDate();
  const startMonth = integerToMonth[castTimeFormat(startDate.getMonth() + 1)];
  const start = `${startMonth} ${startDay}`;

  const endDate = sorted[sorted.length - 1].events.slice(-1).pop().time.end;
  const endDay = endDate.toString().split(` `)[2];
  const endMonth = endDate.toString().split(` `)[1];
  const end = (startMonth === endMonth) ? `${endDay}` : `${endMonth} ${endDay}`;
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getRoute(sortedEvents)}</h1>
        <p class="trip-info__dates">${start}&nbsp;&mdash;&nbsp;${end}</p>
      </div>
    </section>`
  );
};

export default getInfoMarkup;
