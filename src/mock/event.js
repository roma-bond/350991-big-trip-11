import {getRandomTime, getRandomInteger, getRandomPrice, getRandomArrayItem, getRandomArrayItems} from '../utils/common.js';
import {EVENT_TYPES, CITIES, offersToType, INFO} from './const.js';

const generateEvent = () => {
  const type = getRandomArrayItem(EVENT_TYPES);

  return {
    type,
    time: getRandomTime(),
    price: getRandomPrice(),
    offers: getRandomArrayItems(offersToType[type.type], 3),
    destination: getRandomArrayItem(CITIES),
    destinationInfo: {info: getRandomArrayItems(INFO, 5), photos: getRandomInteger(0, 3)}
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export default generateEvents;
