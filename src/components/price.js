const getPriceMarkup = (sum) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>`
  );
};

export default getPriceMarkup;
