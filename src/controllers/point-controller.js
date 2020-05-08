import EditComponent from '../components/edit.js';
import EventComponent from '../components/event.js';
import {RenderPosition, render, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._editComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onEditSubmit = this._onEditSubmit.bind(this);
  }

  render(event) {
    const oldEventComponent = this._eventComponent;
    const oldEditComponent = this._editComponent;

    this._editComponent = new EditComponent(event);
    this._eventComponent = new EventComponent(event);

    this._eventComponent.setOpenButtonClickHandler(() => {
      this._onViewChange();
      replace(this._editComponent, this._eventComponent);
      this._mode = Mode.EDIT;
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });
    this._editComponent.setCloseButtonClickHandler(() => {
      replace(this._eventComponent, this._editComponent);
      this._mode = Mode.DEFAULT;
    });
    this._editComponent.setSubmitHandler(this._onEditSubmit);

    this._editComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    if (oldEditComponent && oldEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._editComponent, oldEditComponent);
    } else {
      render(this._container, this._eventComponent, RenderPosition.BEFORE_END);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      replace(this._eventComponent, this._editComponent);
    }
  }

  _onEditSubmit(evt) {
    evt.preventDefault();
    replace(this._eventComponent, this._editComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replace(this._eventComponent, this._editComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

export default PointController;
