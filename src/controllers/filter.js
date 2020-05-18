import FilterComponent from "../components/filters.js";
import {FilterType} from "../mock/const.js";
import {render, RenderPosition} from "../utils/render.js";

class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    this._filterComponent = new FilterComponent();

    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    render(container, this._filterComponent, RenderPosition.BEFORE_END);
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}

export default FilterController;
