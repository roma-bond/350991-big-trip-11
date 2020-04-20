const getRandomTime = () => {
  const startDay = getRandomInteger(1, 28);
  const endDay = startDay + getRandomInteger(0, 2);

  let startHour = getRandomInteger(0, 23);
  let endHour = getRandomInteger(0, 23);

  if ((startDay === endDay) && (startHour > endHour)) {
    [startHour, endHour] = [endHour, startHour];
  }

  let startMin = getRandomInteger(0, 59);
  let endMin = getRandomInteger(0, 59);

  if ((startDay === endDay) && (startHour === endHour) && (startMin > endMin)) {
    [startMin, endMin] = [endMin, startMin];
  }

  startHour = (startHour < 10) ? `0${startHour}` : `${startHour}`;
  endHour = (endHour < 10) ? `0${endHour}` : `${endHour}`;
  startMin = (startMin < 10) ? `0${startMin}` : `${startMin}`;
  endMin = (endMin < 10) ? `0${endMin}` : `${endMin}`;

  const start = `${startDay}/06/2020 ${startHour}:${startMin}`;
  const end = `${endDay}/06/2020 ${endHour}:${endMin}`;

  return {start, end};
};

const getRandomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomPrice = () => getRandomInteger(1, 50) * 10;

const getRandomBoolean = () => Math.random() > 0.5 ? true : false;

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

export {getRandomTime, getRandomInteger, getRandomPrice, getRandomArrayItem, getRandomArrayItems, getRandomBoolean};
