import SortComponent, {SortType} from '../components/sorting.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point-controller.js";
import DaysListComponent from '../components/days-list.js';
import DayComponent from '../components/day.js';
import NoEventsComponent from "../components/no-events.js";
import StatsComponent from '../components/statistics.js';
import {FilterType} from "../mock/const.js";
import {RenderPosition, render, remove} from '../utils/render.js';

const DATE_FIRST_CHAR_INDEX = 4;
const DATE_LAST_CHAR_INDEX = 15;

const addNewEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);

const sortEventsPerDay = (events) => {
  const eventsCopy = events.slice();
  const sortedEvents = [];
  eventsCopy.sort((a, b) => {
    return a.time.start - b.time.start;
  }).forEach((event) => {
    const eventDate = event.time.start.toString().slice(DATE_FIRST_CHAR_INDEX, DATE_LAST_CHAR_INDEX);
    if ((sortedEvents.length !== 0) && (eventDate === sortedEvents[sortedEvents.length - 1].date.toString().slice(DATE_FIRST_CHAR_INDEX, DATE_LAST_CHAR_INDEX))) {
      sortedEvents[sortedEvents.length - 1].events.push(event);
    } else {
      sortedEvents.push({'date': event.time.start, 'events': [event]});
    }
  });
  return sortedEvents;
};

const renderEventsPerDay = (day, eventsList, onDataChange, onViewChange, destinations, offers) => {
  return day.events.slice().map((event) => {
    const pointController = new PointController(eventsList, onDataChange, onViewChange, destinations, offers);
    pointController.render(event, PointControllerMode.DEFAULT);
    return pointController;
  });
};

const renderDefaultSort = (sortedEvents, daysListElement, onDataChange, onViewChange, destinations, offers) => {
  let controllers = [];
  sortedEvents.slice().forEach((day, index) => {
    const dayComponent = new DayComponent(day.date, SortType.DEFAULT, index);
    const dayElement = dayComponent.getElement();
    const tripDayEventsList = dayElement.querySelector(`.trip-events__list`);
    render(daysListElement, dayComponent, RenderPosition.BEFORE_END);
    controllers = controllers.concat(renderEventsPerDay(day, tripDayEventsList, onDataChange, onViewChange, destinations, offers));
  });
  return controllers;
};

const renderUserSortedEvents = (sortedEvents, daysListElement, sortType, onDataChange, onViewChange, destinations, offers) => {
  return sortedEvents.slice().map((event, index) => {
    const dayComponent = new DayComponent(event.time.start, sortType, index);
    const dayElement = dayComponent.getElement();
    const tripDay = dayElement.querySelector(`.trip-events__list`);
    render(daysListElement, dayComponent, RenderPosition.BEFORE_END);
    const pointController = new PointController(tripDay, onDataChange, onViewChange, destinations, offers);
    pointController.render(event, PointControllerMode.DEFAULT);
    return pointController;
  });
};

const renderEvents = (userSortedEvents, daysListElement, sortType, onDataChange, onViewChange, destinations, offers) => {
  let pointControllers = [];
  if (sortType === SortType.DEFAULT) {
    pointControllers = renderDefaultSort(userSortedEvents, daysListElement, onDataChange, onViewChange, destinations, offers);
  } else {
    pointControllers = renderUserSortedEvents(userSortedEvents, daysListElement, sortType, onDataChange, onViewChange, destinations, offers);
  }
  return pointControllers;
};

class TripController {
  constructor(container, pointsModel, api, headerController) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;
    this._headerController = headerController;

    this._showedPointControllers = [];
    this._sortedEvents = [];

    this._noTasksComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
    this._statsComponent = new StatsComponent(this._pointsModel.getPointsNotFiltered());
    this._creatingEvent = null;
    this._isStatsModeOn = false;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    addNewEventButtonElement.disabled = true;
    this._onViewChange();
    remove(this._sortComponent);

    if ((this._sortComponent.getSortType() !== SortType.DEFAULT) || (this._pointsModel.getActiveFilterType() !== FilterType.EVERYTHING)) {
      this._removePoints();
      this._pointsModel.setFilter(FilterType.EVERYTHING);
    }

    this._creatingEvent = new PointController(this._container, this._onDataChange, this._onViewChange, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
    this._creatingEvent.render(EmptyPoint, PointControllerMode.ADDING);
    this._showedPointControllers.push(this._creatingEvent);

    render(this._container, this._sortComponent, RenderPosition.AFTER_BEGIN);
  }

  getSortedEvents() {
    return this._sortedEvents;
  }

  renderStats() {
    this._isStatsModeOn = true;
    this._statsComponent.show(this._pointsModel.getPointsNotFiltered());
    this._sortComponent.hide();
    this._daysListComponent.hide();
    this._sortComponent.setDefaultSortType();

    render(this._container, this._statsComponent, RenderPosition.AFTER);
  }

  renderTable() {
    this._isStatsModeOn = false;
    this._sortEvents();
    this._statsComponent.hide();
    this._removePoints();

    if (this._sortedEvents.length === 0) {
      render(this._container, this._noTasksComponent, RenderPosition.BEFORE_END);
    } else {
      this._renderPointsList();
      const sortType = this._sortComponent.getSortType();
      this._renderPoints(this._sortEvents(sortType), sortType);
    }
    this._sortComponent.show();
    this._daysListComponent.show();
  }

  _onDataChange(pointController, oldEvent, newEvent) {
    if (oldEvent === EmptyPoint) {
      if (newEvent === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._api.createEvent(newEvent.toRaw())
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            this._sortedEvents = this._sortEvents();
            const sortType = this._sortComponent.getSortType();
            this._removePoints();
            this._renderPoints(this._sortEvents(sortType), sortType);

            this._headerController.rerender(this._sortedEvents);
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newEvent === null) {
      this._api.deleteEvent(oldEvent.id)
        .then(() => {
          this._pointsModel.removePoint(oldEvent.id);
          this._updatePoints();

          this._sortedEvents = this._sortEvents();
          this._headerController.rerender(this._sortedEvents);
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updateEvent(oldEvent.id, newEvent.toRaw())
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldEvent.id, pointModel);

          if (isSuccess) {
            pointController.render(pointModel, PointControllerMode.DEFAULT);
          }

          this._sortedEvents = this._sortEvents();
          this._headerController.rerender(this._sortedEvents);
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onFilterChange() {
    if (this._isStatsModeOn) {
      this._statsComponent.rerender(this._pointsModel.getPoints());
    } else {
      this._updatePoints();
      this._headerController.rerender(this._sortedEvents);
    }
  }

  _onViewChange() {
    if (this._creatingEvent) {
      this._creatingEvent.destroy();
      this._creatingEvent = null;
      this._showedPointControllers.pop();
    }
    this._showedPointControllers.forEach((pointController) => pointController.setDefaultView());
    addNewEventButtonElement.disabled = false;
  }

  _removePoints() {
    this._showedPointControllers.forEach((eventController) => eventController.destroy());
    this._showedPointControllers = [];
    remove(this._daysListComponent);
    remove(this._sortComponent);
    this._renderPointsList();
  }

  _renderPoints(points, sort = SortType.DEFAULT) {
    points = (points.date) ? points : this._sortEvents();
    const daysListElement = this._daysListComponent.getElement();
    this._showedPointControllers = renderEvents(points, daysListElement, sort, this._onDataChange, this._onViewChange, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
  }

  _renderPointsList() {
    render(this._container, this._sortComponent, RenderPosition.BEFORE_END);
    render(this._container, this._daysListComponent, RenderPosition.BEFORE_END);

    this._sortComponent.setDefaultSortType();
    this._sortComponent.setSortTypeChangeHandler((sort) => {
      const userSortedEvents = this._sortEvents(sort);
      const daysListElement = this._daysListComponent.getElement();
      daysListElement.innerHTML = ``;
      this._showedPointControllers = renderEvents(userSortedEvents, daysListElement, sort, this._onDataChange, this._onViewChange, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
    });
    this._creatingEvent = null;
    addNewEventButtonElement.disabled = false;
  }

  _sortEvents(sortType = SortType.DEFAULT) {
    let sortedEvents = [];
    const pointsCopy = this._pointsModel.getPoints().slice();

    switch (sortType) {
      case SortType.TIME:
        sortedEvents = pointsCopy.sort((a, b) => (b.time.end - b.time.start) - (a.time.end - a.time.start));
        break;
      case SortType.PRICE:
        sortedEvents = pointsCopy.sort((a, b) => b.price - a.price);
        break;
      case SortType.DEFAULT:
        sortedEvents = sortEventsPerDay(pointsCopy);
        break;
    }

    this._sortedEvents = sortedEvents;
    return sortedEvents;
  }

  _updatePoints() {
    this._removePoints();
    this._creatingEvent = null;
    this._renderPoints(this._pointsModel.getPoints().slice(0));
  }
}

export default TripController;
