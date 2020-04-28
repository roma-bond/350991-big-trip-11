import InfoComponent from './components/info.js';
import PriceComponent from './components/price.js';
import MenuComponent from './components/site-menu.js';
import FiltersComponent from './components/filters.js';
import SortComponent from './components/sorting.js';
import EditComponent from './components/edit.js';
import DaysListComponent from './components/days-list.js';
import DayComponent from './components/day.js';
import EventComponent from './components/event.js';
import NoEventsComponent from "./components/no-events.js";
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

const renderHeader = (sortedEvents) => {
  const infoComponent = new InfoComponent(sortedEvents);
  const infoElement = infoComponent.getElement();
  render(tripMainElement, infoElement, RenderPosition.AFTER_BEGIN);

  const totalPrice = sortedEvents.reduce((sum, evnt) => {
    return sum + evnt.events.reduce((sumDay, event) => {
      return sumDay + event.price;
    }, 0);
  }, 0);
  const priceComponent = new PriceComponent(totalPrice);
  const priceElement = priceComponent.getElement();
  render(infoElement, priceElement, RenderPosition.BEFORE_END);

  const menuComponent = new MenuComponent();
  const filtersHeader = tripControls.querySelectorAll(`h2`)[1];
  render(filtersHeader, menuComponent.getElement(), RenderPosition.BEFORE);

  const filtersComponent = new FiltersComponent();
  render(tripControls, filtersComponent.getElement(), RenderPosition.BEFORE_END);
};

const renderEventsPerDay = (day, eventsList) => {
  day.events.slice().forEach((event) => {
    const showEdit = () => {
      eventsList.replaceChild(editElement, eventElement);
    };

    const showEvent = () => {
      eventsList.replaceChild(eventElement, editElement);
    };

    const onOpenButtonClick = (evt) => {
      evt.preventDefault();
      showEdit(editElement, eventElement);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onCloseButtonClick = (evt) => {
      evt.preventDefault();
      showEvent(editElement, eventElement);
    };

    const onEditSubmit = (evt) => {
      evt.preventDefault();
      showEvent(editElement, eventElement);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        showEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const editComponent = new EditComponent(event);
    const editElement = editComponent.getElement();
    const eventComponent = new EventComponent(event);
    const eventElement = eventComponent.getElement();

    const openButton = eventElement.querySelector(`.event__rollup-btn`);
    const closeButton = editElement.querySelector(`.event__rollup-btn`);

    openButton.addEventListener(`click`, onOpenButtonClick);
    closeButton.addEventListener(`click`, onCloseButtonClick);
    editElement.addEventListener(`submit`, onEditSubmit);
    render(eventsList, eventElement, RenderPosition.BEFORE_END);
  });
};

const renderEvents = (sortedEvents) => {
  if (sortedEvents.length === 0) {
    render(tripEventsElement, new NoEventsComponent().getElement(), RenderPosition.BEFORE_END);
  } else {
    const sortComponent = new SortComponent();
    render(tripEventsElement, sortComponent.getElement(), RenderPosition.BEFORE_END);

    const daysListComponent = new DaysListComponent();
    const daysListElement = daysListComponent.getElement();
    render(tripEventsElement, daysListElement, RenderPosition.BEFORE_END);

    sortedEvents.slice().forEach((day) => {
      const dayComponent = new DayComponent(day.date);
      const dayElement = dayComponent.getElement();
      const tripDayEventsList = dayElement.querySelector(`.trip-events__list`);
      render(daysListElement, dayElement, RenderPosition.BEFORE_END);
      renderEventsPerDay(day, tripDayEventsList);
    });
  }
};

const EVENT_COUNT = 20;
const events = generateEvents(EVENT_COUNT);
const sortedEvents = sortEventsPerDay(events);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

renderHeader(sortedEvents);
renderEvents(sortedEvents);
