import API from "./api.js";
import HeaderController from "./controllers/header-controller.js";
import PointsModel from "./models/points.js";
import TripController from "./controllers/trip-controller.js";
import {MenuItem} from "./components/site-menu.js";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

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

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();

const tripEventsElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsElement, pointsModel, api);

const tripMainElement = document.querySelector(`.trip-main`);
const headerController = new HeaderController(tripMainElement, pointsModel, setOnModeChange);

const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
addEventButton.addEventListener(`click`, () => {
  tripController.createEvent();
});

api.getEvents()
  .then((events) => {
    pointsModel.setPoints(events);
    tripController.renderTable();
    headerController.render(tripController.getSortedEvents());
  });
