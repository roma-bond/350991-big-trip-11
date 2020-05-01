import AbstractComponent from "./abstract-component.js";

const getNoEventsMarkup = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

class NoEvents extends AbstractComponent {
  getTemplate() {
    return getNoEventsMarkup();
  }
}

export default NoEvents;
