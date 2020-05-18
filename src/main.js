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
tripController.render();

const tripMainElement = document.querySelector(`.trip-main`);
const headerController = new HeaderController(tripMainElement, pointsModel);
headerController.render(tripController.getSortedEvents());

const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
addEventButton.addEventListener(`click`, () => {
  tripController.createEvent();
});
