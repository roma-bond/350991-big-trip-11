import TripController from "./controllers/trip-controller.js";
import InfoComponent from './components/info.js';
import PriceComponent from './components/price.js';
import MenuComponent from './components/site-menu.js';
import FiltersComponent from './components/filters.js';
import {default as generateEvents} from './mock/event.js';
import {RenderPosition, render} from './utils/render.js';

const renderHeader = (sortedEvents) => {
  const infoComponent = new InfoComponent(sortedEvents);
  const infoElement = infoComponent.getElement();
  render(tripMainElement, infoComponent, RenderPosition.AFTER_BEGIN);

  const totalPrice = sortedEvents.reduce((sum, evnt) => {
    return sum + evnt.events.reduce((sumDay, event) => {
      return sumDay + event.price;
    }, 0);
  }, 0);

  render(infoElement, new PriceComponent(totalPrice), RenderPosition.BEFORE_END);

  const filtersHeader = tripControls.querySelectorAll(`h2`)[1];
  render(filtersHeader, new MenuComponent(), RenderPosition.BEFORE);
  render(tripControls, new FiltersComponent(), RenderPosition.BEFORE_END);
};

const EVENT_COUNT = 20;
const events = generateEvents(EVENT_COUNT);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControls = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEventsElement, events);

tripController.render();
renderHeader(tripController.getSortedEvents());
