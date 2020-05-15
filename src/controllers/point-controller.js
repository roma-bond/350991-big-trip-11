import EditComponent from '../components/edit.js';
import EventComponent from '../components/event.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  id: String(new Date() + Math.random()),
  type:
    {
      group: `Transfer`,
      type: `Taxi`
    },
  time:
    {
      start: new Date(),
      end: new Date()
    },
  price: 0,
  offers: [],
  destination: ``,
  destinationInfo: {info: [], photos: 0}
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
  }

  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEditComponent = this._editComponent;
    this._mode = mode;

    this._editComponent = new EditComponent(event);
    this._eventComponent = new EventComponent(event);

    this._eventComponent.setOpenButtonClickHandler(() => {
      this._onViewChange();
      replace(this._editComponent, this._eventComponent);
      this._mode = Mode.EDIT;
      document.addEventListener(`keydown`, this._onEscKeyDown);
      this._editComponent.getData();
    });

    this._editComponent.setCloseButtonClickHandler(() => {
      replace(this._eventComponent, this._editComponent);
      this._mode = Mode.DEFAULT;
    });

    this._editComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._editComponent.getData();
      this._onDataChange(this, event, data);
    });

    this._editComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, event, null));

    this._editComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._editComponent, oldEditComponent);
          replace(this._eventComponent, this._editComponent);
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFORE_END);
        }
        break;
      case Mode.ADDING:
        if (oldEditComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._editComponent, RenderPosition.AFTER_BEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      replace(this._eventComponent, this._editComponent);
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      replace(this._eventComponent, this._editComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

export default PointController;
