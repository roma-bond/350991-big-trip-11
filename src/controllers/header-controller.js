import FiltersController from '../controllers/filter.js';
import InfoComponent from '../components/info.js';
import PriceComponent from '../components/price.js';
import MenuComponent from '../components/site-menu.js';
import {RenderPosition, render} from '../utils/render.js';

const tripControls = document.querySelector(`.trip-controls`);

class HeaderController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
  }

  render(sortedEvents) {
    const infoComponent = new InfoComponent(sortedEvents);
    const infoElement = infoComponent.getElement();
    render(this._container, infoComponent, RenderPosition.AFTER_BEGIN);

    const totalPrice = sortedEvents.reduce((sum, evnt) => {
      return sum + evnt.events.reduce((sumDay, event) => {
        return sumDay + event.price;
      }, 0);
    }, 0);

    render(infoElement, new PriceComponent(totalPrice), RenderPosition.BEFORE_END);

    const filtersHeader = tripControls.querySelectorAll(`h2`)[1];
    render(filtersHeader, new MenuComponent(), RenderPosition.BEFORE);
    const filtersController = new FiltersController(tripControls, this._pointsModel);
    filtersController.render();
  }
}

export default HeaderController;
