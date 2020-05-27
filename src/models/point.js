import {EVENT_TYPES} from "../mock/const.js";

const getType = (pointType) => {
  pointType = (pointType !== `check-in`) ? pointType : `check`;
  return EVENT_TYPES.find((eventType) => eventType.type.toLowerCase() === pointType);
};

const getTime = (startDate, endDate) => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  return {start, end};
};

const getInfo = (description, photos) => {
  description = description || ``;


  return {info: description, photos};
};

class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = getType(data[`type`]);
    this.time = getTime(data[`date_from`], data[`date_to`]);
    this.destination = data[`destination`][`name`];
    this.destinationInfo = getInfo(data[`destination`][`description`], data[`destination`][`pictures`]);
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.isFavorite = data[`is_favorite`] || false;
  }

  toRaw() {
    let type = this.type.type.toLowerCase();
    type = (type !== `check`) ? type : `check-in`;
    const offers = Array.from(this.offers);
    offers.forEach((offer) => {
      offer.price++;
    });

    return {
      "id": this.id,
      "type": type,
      "base_price": parseInt(this.price, 10),
      "is_favorite": this.isFavorite,
      "offers": offers,
      "destination": {
        "description": this.destinationInfo.info,
        "name": this.destination,
        "pictures": this.destinationInfo.photos
      },
      "date_from": this.time.start.toISOString(),
      "date_to": this.time.end.toISOString()
    };
  }

  static parseEvent(event) {
    return new Point(event);
  }

  static parseEvents(events) {
    return events.map(Point.parseEvent);
  }

  static clone(event) {
    return new Point(event);
  }
}

export default Point;
