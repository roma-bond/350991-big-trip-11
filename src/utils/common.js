import moment from "moment";

const getDuration = (time) => {
  const start = moment(time.start);
  const end = moment(time.end);

  let days = end.diff(start, `days`);
  let hours = end.diff(start, `hours`) % 24;
  let mins = end.diff(start, `minutes`) % 60;

  days = (days < 10) ? `0${days}` : days;
  hours = (hours < 10) ? `0${hours}` : hours;
  mins = (mins < 10) ? `0${mins}` : mins;

  return `${days}D ${hours}H ${mins}M`;
};

const castTimeFormat = (value) => value < 10 ? `0${value}` : String(value);

const getRandomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomBoolean = () => Math.random() > 0.5;

const getRandomArrayItems = function (items, max) {
  const arrayCopy = items.slice();
  const selection = [];
  const selectionLength = max ? Math.min(max, arrayCopy.length) : getRandomInteger(0, arrayCopy.length);
  for (let i = 0; i < selectionLength; i++) {
    const selectionElement = arrayCopy.splice(getRandomInteger(0, arrayCopy.length - 1), 1)[0];
    selection.push(selectionElement);
  }

  return selection;
};

export {getDuration, castTimeFormat, getRandomArrayItems, getRandomBoolean};
