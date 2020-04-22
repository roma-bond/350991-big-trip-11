import {default as getInfoMarkup} from './components/info.js';
import {default as getPriceMarkup} from './components/price.js';
import {default as getMenuMarkup} from './components/menu.js';
import {default as getFiltersMarkup} from './components/filters.js';
import {default as getSortEventsMarkup} from './components/sorting.js';
import {default as getEventEditMarkup} from './components/edit.js';
import {default as getDaysListMarkup} from './components/days-list.js';
import {default as getDayMarkup} from './components/day.js';
import {default as getEventMarkup} from './components/event.js';
import {default as generateEvents} from './mock/event.js';

const sortEventsPerDay = (events) => {
  const eventsCopy = events.slice();
  let sorted = [];
  eventsCopy.sort((a, b) => {
    return a.time.start - b.time.start;
  }).forEach((evt) => {
    const eventDate = evt.time.start.toString().slice(4, 15);
    if ((sorted.length === 0) || (sorted[sorted.length - 1].date.toString().slice(4, 15) !== eventDate)) {
      sorted.push({'date': evt.time.start, 'events': [evt]});
    } else {
      sorted[sorted.length - 1].events.push(evt);
    }
  });
  return sorted;
};

const EVENT_COUNT = 20;
const events = generateEvents(EVENT_COUNT);
const sortedEvents = sortEventsPerDay(events);

const render = (container, markup, place) => {
  container.insertAdjacentHTML(place, markup);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, getInfoMarkup(sortedEvents), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info__main`);
const totalPrice = events.reduce((sum, event) => {
  return sum + event.price;
}, 0);
render(tripInfoElement, getPriceMarkup(totalPrice), `afterend`);

const tripControlHeadingElements = document.querySelectorAll(`.trip-controls h2`);
const menuHeadingElement = tripControlHeadingElements[0];
const filtersHeadingElement = tripControlHeadingElements[1];
render(menuHeadingElement, getMenuMarkup(), `afterend`);

render(filtersHeadingElement, getFiltersMarkup(), `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, getSortEventsMarkup(), `beforeend`);

render(tripEventsElement, getEventEditMarkup(sortedEvents[0]), `beforeend`);

render(tripEventsElement, getDaysListMarkup(), `beforeend`);
const daysListElement = document.querySelector(`.trip-days`);
sortedEvents.slice(1).forEach((sortedEvent, i) => {
  const date = sortedEvent.date;
  render(daysListElement, getDayMarkup(date), `beforeend`);
  const tripDayEventsList = document.querySelectorAll(`.trip-events__list`)[i];
  sortedEvent.events.slice().forEach((event) => render(tripDayEventsList, getEventMarkup(event), `beforeend`));
});
