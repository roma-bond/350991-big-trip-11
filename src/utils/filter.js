import {FilterType} from "../mock/const.js";

const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();
  let filteredPoints = [];

  switch (filterType) {
    case FilterType.EVERYTHING:
      filteredPoints = points.slice(0);
      break;
    case FilterType.PAST:
      filteredPoints = points.filter((point) => point.time.end < nowDate);
      break;
    case FilterType.FUTURE:
      filteredPoints = points.filter((point) => point.time.start > nowDate);
  }
  return filteredPoints;
};

export {getPointsByFilter};
