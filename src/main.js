import InfoComponent from './components/info.js';
import PriceComponent from './components/price.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';
import SortComponent from './components/sorting.js';
import EditComponent from './components/edit.js';
import DaysListComponent from './components/days-list.js';
import DayComponent from './components/day.js';
import EventComponent from './components/event.js';
import {default as generateEvents} from './mock/event.js';
import {render, RenderPosition} from './utils/dom.js';

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

const renderHeader = () => {
  const infoComponent = new InfoComponent();
  render(tripMainElement, infoComponent.getElement(sortedEvents), RenderPosition.AFTERBEGIN);

  const tripInfoElement = document.querySelector(`.trip-info`);
  const totalPrice = events.reduce((sum, event) => {
    return sum + event.price;
  }, 0);
  const priceComponent = new PriceComponent();
  render(tripInfoElement, priceComponent.getElement(totalPrice), RenderPosition.BEFOREEND);

  const menuComponent = new MenuComponent();
  render(tripControls, menuComponent.getElement(), RenderPosition.AFTERBEGIN);

  const filtersComponent = new FiltersComponent();
  render(tripControls, filtersComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderEventsPerDay = (day, eventsList) => {
  day.events.slice().forEach((event) => {
    const showEdit = (editElement, eventElement) => {
      eventsList.replaceChild(editElement, eventElement);
    };

    const showEvent = (editElement, eventElement) => {
      eventsList.replaceChild(eventElement, editElement);
    };

    const onOpenButtonClick = (evt) => {
      evt.preventDefault();
      showEdit(editElement, eventElement);
    };

    const onCloseButtonClick = (evt) => {
      evt.preventDefault();
      showEvent(editElement, eventElement);
    };

    const onEditSubmit = (evt) => {
      evt.preventDefault();
      showEvent(editElement, eventElement);
    };

    const editComponent = new EditComponent();
    const [editElement] = [...editComponent.getElement(event)];
    const eventComponent = new EventComponent();
    const [eventElement] = [...eventComponent.getElement(event)];

    const openButton = eventElement.querySelector(`.event__rollup-btn`);
    const closeButton = editElement.querySelector(`.event__rollup-btn`);

    openButton.addEventListener(`click`, onOpenButtonClick);
    closeButton.addEventListener(`click`, onCloseButtonClick);
    editElement.addEventListener(`submit`, onEditSubmit);
    render(eventsList, [eventElement], RenderPosition.BEFOREEND);
  });
};

const renderEvents = () => {
  const sortComponent = new SortComponent();
  render(tripEventsElement, sortComponent.getElement(), RenderPosition.BEFOREEND);

  const daysListComponent = new DaysListComponent();
  render(tripEventsElement, daysListComponent.getElement(), RenderPosition.BEFOREEND);
  const daysListElement = document.querySelector(`.trip-days`);
  sortedEvents.slice(0).forEach((day, i) => {
    const date = day.date;
    const dayComponent = new DayComponent();
    render(daysListElement, dayComponent.getElement(date), RenderPosition.BEFOREEND);
    const tripDayEventsList = document.querySelectorAll(`.trip-events__list`)[i];
    renderEventsPerDay(day, tripDayEventsList);
  });
};

const EVENT_COUNT = 20;
const events = generateEvents(EVENT_COUNT);
const sortedEvents = sortEventsPerDay(events);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

renderHeader();
renderEvents();
