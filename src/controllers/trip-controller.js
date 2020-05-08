import SortComponent, {SortType} from '../components/sorting.js';
import PointController from "./point-controller.js";
import DaysListComponent from '../components/days-list.js';
import DayComponent from '../components/day.js';
import NoEventsComponent from "../components/no-events.js";
import {RenderPosition, render} from '../utils/render.js';

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

const renderEventsPerDay = (day, eventsList, onDataChange, onViewChange) => {
  return day.events.slice().map((event) => {
    const pointController = new PointController(eventsList, onDataChange, onViewChange);
    pointController.render(event);
    return pointController;
  });
};

const renderDefaultSort = (sortedEvents, daysListElement, onDataChange, onViewChange) => {
  let controllers = [];
  sortedEvents.slice().forEach((day) => {
    const dayComponent = new DayComponent(day.date);
    const dayElement = dayComponent.getElement();
    const tripDayEventsList = dayElement.querySelector(`.trip-events__list`);
    render(daysListElement, dayComponent, RenderPosition.BEFORE_END);
    controllers = controllers.concat(renderEventsPerDay(day, tripDayEventsList, onDataChange, onViewChange));
  });
  return controllers;
};

const renderUserSortedEvents = (sortedEvents, daysListElement, onDataChange, onViewChange) => {
  return sortedEvents.slice().map((event) => {
    const dayComponent = new DayComponent(event.time.start);
    const dayElement = dayComponent.getElement();
    const tripDay = dayElement.querySelector(`.trip-events__list`);
    render(daysListElement, dayComponent, RenderPosition.BEFORE_END);
    const pointController = new PointController(tripDay, onDataChange, onViewChange);
    pointController.render(event);
    return pointController;
  });
};

const renderEvents = (userSortedEvents, daysListElement, sortType, onDataChange, onViewChange) => {
  if (sortType === SortType.DEFAULT) {
    renderDefaultSort(userSortedEvents, daysListElement, onDataChange, onViewChange);
  } else {
    renderUserSortedEvents(userSortedEvents, daysListElement, onDataChange, onViewChange);
  }
};

class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events.map((it) => Object.assign({}, it, {isFavorite: false}));
    this._showedEventControllers = [];
    this._sortedEvents = this.getSortedEvents();

    this._noTasksComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  _onDataChange(eventController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    eventController.render(this._events[index]);
  }

  _onViewChange() {
    this._showedEventControllers.forEach((it) => it.setDefaultView());
  }

  render() {
    if (this._sortedEvents.length === 0) {
      render(this._container, this._noTasksComponent, RenderPosition.BEFORE_END);
    } else {
      render(this._container, this._sortComponent, RenderPosition.BEFORE_END);

      const daysListElement = this._daysListComponent.getElement();
      render(this._container, this._daysListComponent, RenderPosition.BEFORE_END);
      this._showedEventControllers = renderDefaultSort(this._sortedEvents, daysListElement, this._onDataChange, this._onViewChange);
    }

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const userSortedEvents = this.getSortedEvents(sortType);
      const daysListElement = this._daysListComponent.getElement();
      daysListElement.innerHTML = ``;
      this._showedEventControllers = renderEvents(userSortedEvents, daysListElement, sortType, this._onDataChange, this._onViewChange);
    });
  }

  getSortedEvents(sortType = SortType.DEFAULT) {
    let sortedEvents = [];
    const eventsCopy = this._events.slice();

    switch (sortType) {
      case SortType.TIME:
        sortedEvents = eventsCopy.sort((a, b) => (b.time.end - b.time.start) - (a.time.end - a.time.start));
        break;
      case SortType.PRICE:
        sortedEvents = eventsCopy.sort((a, b) => b.price - a.price);
        break;
      case SortType.DEFAULT:
        sortedEvents = sortEventsPerDay(eventsCopy);
        break;
    }
    return sortedEvents;
  }
}

export default TripController;
