import SortComponent from '../components/sorting.js';
import EditComponent from '../components/edit.js';
import DaysListComponent from '../components/days-list.js';
import DayComponent from '../components/day.js';
import EventComponent from '../components/event.js';
import NoEventsComponent from "../components/no-events.js";
import {RenderPosition, render, replace} from '../utils/render.js';

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

class TripController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
  }

  render(sortedEvents) {
    if (sortedEvents.length === 0) {
      render(this._container, this._noTasksComponent, RenderPosition.BEFORE_END);
    } else {
      render(this._container, this._sortComponent, RenderPosition.BEFORE_END);

      const daysListElement = this._daysListComponent.getElement();
      render(this._container, this._daysListComponent, RenderPosition.BEFORE_END);

      sortedEvents.slice().forEach((day) => {
        const dayComponent = new DayComponent(day.date);
        const dayElement = dayComponent.getElement();
        const tripDayEventsList = dayElement.querySelector(`.trip-events__list`);
        render(daysListElement, dayComponent, RenderPosition.BEFORE_END);
        renderEventsPerDay(day, tripDayEventsList);
      });
    }
  }
}

export default TripController;
