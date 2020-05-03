import SortComponent, {SortType} from '../components/sorting.js';
import EditComponent from '../components/edit.js';
import DaysListComponent from '../components/days-list.js';
import DayComponent from '../components/day.js';
import EventComponent from '../components/event.js';
import NoEventsComponent from "../components/no-events.js";
import {RenderPosition, render, replace} from '../utils/render.js';

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

const renderEventsPerDay = (day, eventsList) => {
  day.events.slice().forEach((event) => {
    const onOpenButtonClick = (evt) => {
      evt.preventDefault();
      replace(editComponent, eventComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onCloseButtonClick = (evt) => {
      evt.preventDefault();
      replace(eventComponent, editComponent);
    };

    const onEditSubmit = (evt) => {
      evt.preventDefault();
      replace(eventComponent, editComponent);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replace(eventComponent, editComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const editComponent = new EditComponent(event);
    const eventComponent = new EventComponent(event);

    eventComponent.setOpenButtonClickHandler(onOpenButtonClick);
    editComponent.setCloseButtonClickHandler(onCloseButtonClick);
    editComponent.setSubmitHandler(onEditSubmit);
    render(eventsList, eventComponent, RenderPosition.BEFORE_END);
  });
};

const renderDefaultSort = (sortedEvents, daysListElement) => {
  sortedEvents.slice().forEach((day) => {
    const dayComponent = new DayComponent(day.date);
    const dayElement = dayComponent.getElement();
    const tripDayEventsList = dayElement.querySelector(`.trip-events__list`);
    render(daysListElement, dayComponent, RenderPosition.BEFORE_END);
    renderEventsPerDay(day, tripDayEventsList);
  });
};

const renderEvent = (event, tripDay) => {
  const onOpenButtonClick = (evt) => {
    evt.preventDefault();
    replace(editComponent, eventComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onCloseButtonClick = (evt) => {
    evt.preventDefault();
    replace(eventComponent, editComponent);
  };

  const onEditSubmit = (evt) => {
    evt.preventDefault();
    replace(eventComponent, editComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replace(eventComponent, editComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const editComponent = new EditComponent(event);
  const eventComponent = new EventComponent(event);

  eventComponent.setOpenButtonClickHandler(onOpenButtonClick);
  editComponent.setCloseButtonClickHandler(onCloseButtonClick);
  editComponent.setSubmitHandler(onEditSubmit);
  render(tripDay, eventComponent, RenderPosition.BEFORE_END);
};

const renderUserSortedEvents = (sortedEvents, daysListElement) => {
  sortedEvents.slice().forEach((event) => {
    const dayComponent = new DayComponent(event.time.start);
    const dayElement = dayComponent.getElement();
    const tripDay = dayElement.querySelector(`.trip-events__list`);
    render(daysListElement, dayComponent, RenderPosition.BEFORE_END);
    renderEvent(event, tripDay);
  });
};

class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this.sortedEvents = this.getSortedEvents();

    this._noTasksComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
  }

  render() {
    if (this.sortedEvents.length === 0) {
      render(this._container, this._noTasksComponent, RenderPosition.BEFORE_END);
    } else {
      render(this._container, this._sortComponent, RenderPosition.BEFORE_END);

      const daysListElement = this._daysListComponent.getElement();
      render(this._container, this._daysListComponent, RenderPosition.BEFORE_END);
      renderDefaultSort(this.getSortedEvents(), daysListElement);
    }

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const userSortedEvents = this.getSortedEvents(sortType);
      const daysListElement = this._daysListComponent.getElement();
      daysListElement.innerHTML = ``;
      if (sortType === SortType.DEFAULT) {
        renderDefaultSort(userSortedEvents, daysListElement);
      } else {
        renderUserSortedEvents(userSortedEvents, daysListElement);
      }
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
