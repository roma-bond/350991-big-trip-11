import SortComponent, {SortType} from '../components/sorting.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point-controller.js";
import DaysListComponent from '../components/days-list.js';
import DayComponent from '../components/day.js';
import NoEventsComponent from "../components/no-events.js";
import StatsComponent from '../components/statistics.js';
import {RenderPosition, render, remove} from '../utils/render.js';

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
    pointController.render(event, PointControllerMode.DEFAULT);
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
    pointController.render(event, PointControllerMode.DEFAULT);
    return pointController;
  });
};

const renderEvents = (userSortedEvents, daysListElement, sortType, onDataChange, onViewChange) => {
  let pointControllers = [];
  if (sortType === SortType.DEFAULT) {
    pointControllers = renderDefaultSort(userSortedEvents, daysListElement, onDataChange, onViewChange);
  } else {
    pointControllers = renderUserSortedEvents(userSortedEvents, daysListElement, onDataChange, onViewChange);
  }
  return pointControllers;
};

class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._showedPointControllers = [];
    this._sortedEvents = [];

    this._noTasksComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
    this._statsComponent = new StatsComponent(this._pointsModel.getPointsNotFiltered());
    this._creatingEvent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  renderTable() {
    this._sortEvents();
    this._statsComponent.hide();
    this._removePoints();

    if (this._sortedEvents.length === 0) {
      render(this._container, this._noTasksComponent, RenderPosition.BEFORE_END);
    } else {
      this._renderPointsList();
      let sortType = this._sortComponent.getSortType();
      this._renderPoints(this._sortEvents(sortType), sortType);
    }
    this._sortComponent.show();
    this._daysListComponent.show();
  }

  renderStats() {
    this._statsComponent.show(this._pointsModel.getPointsNotFiltered());
    this._sortComponent.hide();
    this._daysListComponent.hide();
    this._sortComponent.setDefaultSortType();

    render(this._container, this._statsComponent, RenderPosition.AFTER);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    this._onViewChange();

    const dayComponent = new DayComponent(EmptyPoint.time.start);
    const dayElement = dayComponent.getElement();
    const tripDayEventsList = dayElement.querySelector(`.trip-events__list`);
    render(this._daysListComponent.getElement(), dayComponent, RenderPosition.AFTER_BEGIN);
    this._creatingEvent = new PointController(tripDayEventsList, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(EmptyPoint, PointControllerMode.ADDING);
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

  getSortedEvents() {
    return this._sortedEvents;
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints().slice(0));
  }

  _renderPointsList() {
    render(this._container, this._sortComponent, RenderPosition.BEFORE_END);
    render(this._container, this._daysListComponent, RenderPosition.BEFORE_END);

    this._sortComponent.setDefaultSortType();
    this._sortComponent.setSortTypeChangeHandler((sort) => {
      const userSortedEvents = this._sortEvents(sort);
      const daysListElement = this._daysListComponent.getElement();
      daysListElement.innerHTML = ``;
      this._showedPointControllers = renderEvents(userSortedEvents, daysListElement, sort, this._onDataChange, this._onViewChange);
    });
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
    this._showedPointControllers = renderEvents(points, daysListElement, sort, this._onDataChange, this._onViewChange);
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      if (newData === null) {
        pointController.destroy();
        this._updatePonts();
      } else {
        newData.id = String(new Date() + Math.random());
        this._api.createEvent(newData.toRaw())
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            this._sortedEvents = this._sortEvents();
            this._creatingEvent = null;
            let sortType = this._sortComponent.getSortType();
            this._removePoints();
            this._renderPoints(this._sortEvents(sortType), sortType);
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updateEvent(oldData.id, newData.toRaw())
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

          if (isSuccess) {
            pointController.render(pointModel, PointControllerMode.DEFAULT);
          }
        })
        .catch(() => {
          pointController.shake();
        });

    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updatePoints();
  }
}

export default TripController;
