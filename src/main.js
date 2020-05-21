import HeaderController from "./controllers/header-controller.js";
import TripController from "./controllers/trip-controller.js";
import PointsModel from "./models/points.js";
import {MenuItem} from "./components/site-menu.js";
import {default as generateEvents} from './mock/event.js';

const setOnModeChange = (menuItem) => {
  headerController.toggleMode(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      tripController.renderTable();
      break;

    case MenuItem.STATISTICS:
      tripController.renderStats();
      break;
  }
};

const EVENT_COUNT = 4;
const events = generateEvents(EVENT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsElement, pointsModel);
tripController.renderTable();

const tripMainElement = document.querySelector(`.trip-main`);
const headerController = new HeaderController(tripMainElement, pointsModel, setOnModeChange);
headerController.render(tripController.getSortedEvents());

const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
addEventButton.addEventListener(`click`, () => {
  tripController.createEvent();
});
