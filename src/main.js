import HeaderController from "./controllers/header-controller.js";
import TripController from "./controllers/trip-controller.js";
import PointsModel from "./models/points.js";
import {default as generateEvents} from './mock/event.js';

const EVENT_COUNT = 20;
const events = generateEvents(EVENT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsElement, pointsModel);
tripController.renderTable();

const tripMainElement = document.querySelector(`.trip-main`);
const headerController = new HeaderController(tripMainElement, pointsModel);
headerController.render(tripController.getSortedEvents());

const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
addEventButton.addEventListener(`click`, () => {
  tripController.createEvent();
});

const tableModeButton = document.querySelectorAll(`.trip-tabs__btn`)[0];
const statsModeButton = document.querySelectorAll(`.trip-tabs__btn`)[1];

const toggleMode = (evt) => {
  const otherModeElement = evt.target.nextElementSibling || evt.target.previousElementSibling;
  const activeBtn = `trip-tabs__btn--active`;
  if (evt.target.classList.contains(activeBtn)) {
    evt.target.classList.remove(activeBtn);
    otherModeElement.classList.add(activeBtn);
  } else {
    evt.target.classList.add(activeBtn);
    otherModeElement.classList.remove(activeBtn);
  }
};

tableModeButton.addEventListener(`click`, (evt) => {
  toggleMode(evt);
  tripController.renderTable();
});

statsModeButton.addEventListener(`click`, (evt) => {
  toggleMode(evt);
  tripController.renderStats();
});


