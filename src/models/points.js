import {getPointsByFilter} from "../utils/filter.js";
import {FilterType} from "../mock/const.js";

class Points {
  constructor() {
    this._points = [];
    this._offers = [];
    this._destinations = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  addPoint(event) {
    this._points = [].concat(event, this._points);
  }

  getDestinations() {
    return this._destinations;
  }

  getActiveFilterType() {
    return this._activeFilterType;
  }

  getOffers() {
    return this._offers;
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  getPointsNotFiltered() {
    return this._points;
  }

  removePoint(id) {
    const index = this._points.findIndex((pointElement) => pointElement.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    return true;
  }

  setDestinations(destinations) {
    this._destinations = Array.from(destinations);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setOffers(offers) {
    this._offers = Array.from(offers);
  }

  setPoints(events) {
    this._points = Array.from(events);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((pointElement) => pointElement.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));
    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

export default Points;
