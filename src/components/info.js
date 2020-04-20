import {integerToMonth} from '../mock/const.js';

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
  let events = sortedEvents.slice();
  const startDate = events[0].date;
  const startDay = startDate.split(`/`)[0];
  const startMonth = integerToMonth[startDate.split(`/`)[1]];
  const start = `${startMonth} ${startDay}`;

  const endDate = events[events.length - 1].events.pop().time.end.split(` `)[0];
  const endDay = endDate.split(`/`)[0];
  const endMonth = integerToMonth[endDate.split(`/`)[1]];
  const end = (startMonth === endMonth) ? `${endDay}` : `${endMonth} ${endDay}`;
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getRoute(events)}</h1>
        <p class="trip-info__dates">${start}&nbsp;&mdash;&nbsp;${end}</p>
      </div>
    </section>`
  );
};

export default getInfoMarkup;
