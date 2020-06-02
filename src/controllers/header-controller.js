import FiltersController from '../controllers/filter.js';
import InfoComponent from '../components/info.js';
import PriceComponent from '../components/price.js';
import MenuComponent from '../components/site-menu.js';
import {RenderPosition, render, remove} from '../utils/render.js';

const tripControls = document.querySelector(`.trip-controls`);

class HeaderController {
  constructor(container, pointsModel, handler) {
    this._container = container;
    this._menuComponent = new MenuComponent();
    this._handler = handler;
    this._infoComponent = null;
    this._filtersController = null;

    this._pointsModel = pointsModel;
  }

  render(sortedEvents) {
    this._renderInfo(sortedEvents);
    const filtersHeader = tripControls.querySelectorAll(`h2`)[1];
    render(filtersHeader, this._menuComponent, RenderPosition.BEFORE);
    this._menuComponent.setOnModeChange(this._handler);
    this._filtersController = new FiltersController(tripControls, this._pointsModel);
    this._filtersController.render();
  }

  rerender(sortedEvents) {
    remove(this._infoComponent);
    this._filtersController.removeFilterComponent();
    this.render(sortedEvents);
  }

  toggleMode(menuItem) {
    this._menuComponent.setActiveItem(menuItem);
  }

  _renderInfo(sortedEvents) {
    this._infoComponent = new InfoComponent(sortedEvents);
    const infoElement = this._infoComponent.getElement();
    render(this._container, this._infoComponent, RenderPosition.AFTER_BEGIN);

    const totalPrice = sortedEvents.reduce((sum, eventDay) => {
      return sum + eventDay.events.reduce((sumDay, event) => {
        return sumDay + event.price;
      }, 0);
    }, 0);

    render(infoElement, new PriceComponent(totalPrice), RenderPosition.BEFORE_END);
  }
}

export default HeaderController;
