const getDuration = (time) => {
  const startDay = parseInt(time.start.split(` `)[0].split(`/`)[0], 10);
  const endDay = parseInt(time.end.split(` `)[0].split(`/`)[0], 10);
  let dayDiff = endDay - startDay;
  const startHour = parseInt(time.start.split(` `)[1].split(`:`)[0], 10);
  const endHour = parseInt(time.end.split(` `)[1].split(`:`)[0], 10);
  let hourDiff;
  if (endHour > startHour) {
    hourDiff = endHour - startHour;
  } else {
    dayDiff--;
    hourDiff = 24 + endHour - startHour;
  }
  const startMin = parseInt(time.start.split(` `)[1].split(`:`)[1], 10);
  const endMin = parseInt(time.end.split(` `)[1].split(`:`)[1], 10);
  let minDiff;
  if (endMin > startMin) {
    minDiff = endMin - startMin;
  } else {
    minDiff = 60 + endMin - startMin;
    hourDiff--;
    dayDiff = (hourDiff < 0) ? --dayDiff : dayDiff;
  }

  dayDiff = (dayDiff > 0) ? `0${dayDiff}D ` : ``;
  if (hourDiff === 0) {
    hourDiff = ``;
  } else if (hourDiff < 10) {
    hourDiff = `0${hourDiff}H `;
  } else {
    hourDiff = `${hourDiff}H `;
  }
  if (minDiff === 0) {
    minDiff = `00M`;
  } else if (minDiff < 10) {
    minDiff = `0${minDiff}M`;
  } else {
    minDiff = `${minDiff}M`;
  }

  return `${dayDiff}${hourDiff}${minDiff}`;
};

const getOffersMarkup = (offers) => {
  return offers
    .map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    })
    .join(`\n`);
};

const getEventMarkup = (event) => {
  const eventType = (event.type !== `Check`) ? event.type : `Check-in`;

  const activityTypes = new Set([`Check`, `Sightseeing`, `Restaurant`]);
  const title = (activityTypes.has(event.type)) ? `${eventType} in ${event.destination}` : `${eventType} to ${event.destination}`;

  const offersMarkup = getOffersMarkup(event.offers);

  const start = event.time.start.split(` `)[1];
  const end = event.time.end.split(` `)[1];
  const duration = getDuration(event.time);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${title}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-19T10:00">${start}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-19T11:00">${end}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default getEventMarkup;
