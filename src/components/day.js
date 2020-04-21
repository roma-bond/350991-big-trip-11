const getDayMarkup = (date) => {
  const day = date.split(` `)[1];
  const month = date.split(` `)[0];
  const year = date.split(` `)[2];

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${year}-${month}-${day}">${month.toUpperCase()} ${year.slice(2)}</time>
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default getDayMarkup;
