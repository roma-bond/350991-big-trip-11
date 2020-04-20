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
    const dateA = a.time.start.split(` `)[0];
    const timeA = a.time.start.split(` `)[1];
    const yearA = dateA.split(`/`)[2];
    const monthA = dateA.split(`/`)[1];
    const dayA = dateA.split(`/`)[0];
    const hourA = timeA.split(`:`)[0];
    const minA = timeA.split(`:`)[1];

    const dateB = b.time.start.split(` `)[0];
    const timeB = b.time.start.split(` `)[1];
    const yearB = dateB.split(`/`)[2];
    const monthB = dateB.split(`/`)[1];
    const dayB = dateB.split(`/`)[0];
    const hourB = timeB.split(`:`)[0];
    const minB = timeB.split(`:`)[1];

    let comparison;

    if (yearA !== yearB) {
      comparison = yearA - yearB;
    } else if (monthA !== monthB) {
      comparison = monthA - monthB;
    } else if (dayA !== dayB) {
      comparison = dayA - dayB;
    } else if (hourA !== hourB) {
      comparison = hourA - hourB;
    } else if (minA !== minB) {
      comparison = minA - minB;
    }

    return comparison;
  });

  eventsCopy.forEach((event) => {
    const eventDate = event.time.start.split(` `)[0];
    if ((sorted.length === 0) || (sorted[sorted.length - 1].date !== eventDate)) {
      sorted.push({date: eventDate, events: [event]});
    } else {
      sorted[sorted.length - 1].events.push(event);
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
