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

const getDay = (month, year) => {
  const DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return ((month === 2) && (year % 4 === 0)) ? DAYS_PER_MONTH[month - 1] + 1 : DAYS_PER_MONTH[month - 1];
};

const getDateString = (date) => {
  const year = date.getFullYear();
  const month = castTimeFormat(date.getMonth() + 1);
  const day = castTimeFormat(date.getDate());

  return `${year}-${month}-${day}`;
};

const getRandomTime = () => {
  const FORTNIGHT = 1209600000; // 2 weeks in ms
  const year = getRandomInteger(2019, 2020);
  const month = getRandomInteger(1, 12);
  const day = getDay(month, year);
  const hour = getRandomInteger(0, 23);
  const min = getRandomInteger(0, 59);

  const end = new Date(year, month, day, hour, min);
  const elapsed = getRandomInteger(0, FORTNIGHT);
  const start = new Date(end - elapsed);

  return {start, end};
};

const getRandomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomPrice = () => getRandomInteger(1, 50) * 10;

const getRandomBoolean = () => Math.random() > 0.5;

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

const getRandomArrayItems = function (array, max) {
  const arrayCopy = array.slice();
  let selection = [];
  const selectionLength = max ? Math.min(max, arrayCopy.length) : getRandomInteger(0, arrayCopy.length);
  for (let i = 0; i < selectionLength; i++) {
    let selectionElement = arrayCopy.splice(getRandomInteger(0, arrayCopy.length - 1), 1)[0];
    selection.push(selectionElement);
  }

  return selection;
};

export {getDuration, castTimeFormat, getDateString, getRandomTime, getRandomInteger, getRandomPrice, getRandomArrayItem, getRandomArrayItems, getRandomBoolean};
