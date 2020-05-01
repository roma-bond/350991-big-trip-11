import AbstractComponent from "./abstract-component.js";

const getDaysListMarkup = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

class DaysList extends AbstractComponent {
  getTemplate() {
    return getDaysListMarkup();
  }
}

export default DaysList;
