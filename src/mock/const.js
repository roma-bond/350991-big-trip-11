const EVENT_TYPES = [{group: `Transfer`, type: `Taxi`},
  {group: `Transfer`, type: `Bus`},
  {group: `Transfer`, type: `Train`},
  {group: `Transfer`, type: `Ship`},
  {group: `Transfer`, type: `Transport`},
  {group: `Transfer`, type: `Drive`},
  {group: `Transfer`, type: `Flight`},
  {group: `Activity`, type: `Check`},
  {group: `Activity`, type: `Sightseeing`},
  {group: `Activity`, type: `Restaurant`}];

const TRANSFER_EVENT_TYPES = {TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`};

const ACTIVITY_EVENT_TYPES = {CHECK: `Check`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`};

const CITIES = [`Amsterdam`, `Chamonix`, `Geneva`, `London`, `Rome`];
const descriptionTemplate = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const INFO = descriptionTemplate.split(`. `);

const offersToType = {
  'Taxi': [{title: `Order Uber`, price: 25}],
  'Bus': [],
  'Train': [],
  'Ship': [],
  'Transport': [],
  'Drive': [{title: `Rent a car`, price: 90}],
  'Flight': [{title: `Add luggage`, price: 30},
    {title: `Switch to comfort class`, price: 100},
    {title: `Add meal`, price: 15},
    {title: `Travel by train`, price: 40},
    {title: `Choose seats`, price: 5}],
  'Check': [{title: `Add breakfast`, price: 30},
    {title: `Add meal`, price: 15}],
  'Sightseeing': [{title: `Book tickets`, price: 40},
    {title: `Lunch in city`, price: 30}],
  'Restaurant': []
};

const integerToMonth = {
  '01': `jan`,
  '02': `feb`,
  '03': `mar`,
  '04': `apr`,
  '05': `may`,
  '06': `jun`,
  '07': `jul`,
  '08': `aug`,
  '09': `sep`,
  '10': `oct`,
  '11': `nov`,
  '12': `dec`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export {EVENT_TYPES, TRANSFER_EVENT_TYPES, ACTIVITY_EVENT_TYPES, CITIES, offersToType, INFO, integerToMonth, FilterType};
