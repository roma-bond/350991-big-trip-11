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
  constructor(pointData) {
    this.id = pointData[`id`];
    this.type = getType(pointData[`type`]);
    this.time = getTime(pointData[`date_from`], pointData[`date_to`]);
    this.destination = pointData[`destination`][`name`];
    this.destinationInfo = getInfo(pointData[`destination`][`description`], pointData[`destination`][`pictures`]);
    this.price = pointData[`base_price`];
    this.offers = pointData[`offers`];
    this.isFavorite = pointData[`is_favorite`] || false;
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
