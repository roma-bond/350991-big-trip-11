import {default as getInfoMarkup} from './components/info.js';
import {default as getPriceMarkup} from './components/price.js';
import {default as getMenuMarkup} from './components/menu.js';
import {default as getFiltersMarkup} from './components/filters.js';
import {default as getSortEventsMarkup} from './components/sorting.js';
import {default as getEventEditMarkup} from './components/edit.js';
import {default as getDaysListMarkup} from './components/days-list.js';
import {default as getDayMarkup} from './components/day.js';
import {default as getEventMarkup} from './components/event.js';

const EVENT_COUNT = 3;

const render = (container, markup, place) => {
  container.insertAdjacentHTML(place, markup);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, getInfoMarkup(), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info__main`);
render(tripInfoElement, getPriceMarkup(), `afterend`);

const tripControlHeadingElements = document.querySelectorAll(`.trip-controls h2`);
const menuHeadingElement = tripControlHeadingElements[0];
const filtersHeadingElement = tripControlHeadingElements[1];
render(menuHeadingElement, getMenuMarkup(), `afterend`);

render(filtersHeadingElement, getFiltersMarkup(), `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, getSortEventsMarkup(), `beforeend`);

render(tripEventsElement, getEventEditMarkup(), `beforeend`);

render(tripEventsElement, getDaysListMarkup(), `beforeend`);
render(tripEventsElement, getDayMarkup(), `beforeend`);
const tripDayEventsList = document.querySelector(`.trip-events__list`);
for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripDayEventsList, getEventMarkup(), `beforeend`);
}
