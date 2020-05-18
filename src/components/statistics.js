import AbstractSmartComponent from "./abstract-smart-component.js";
import {getDuration} from "../utils/common.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const renderMoneyChart = (ctx, events) => {
  const price = {
    fly: 0,
    stay: 0,
    drive: 0,
    look: 0,
    eat: 0,
    public: 0,
    sail: 0,
    coach: 0,
    transit: 0,
    ride: 0
  };

  events.forEach((event) => {
    switch (event.type.type) {
      case `Flight`:
        price.fly += event.price;
        break;
      case `Check`:
        price.stay += event.price;
        break;
      case `Drive`:
        price.drive += event.price;
        break;
      case `Sightseeing`:
        price.look += event.price;
        break;
      case `Restaurant`:
        price.eat += event.price;
        break;
      case `Transport`:
        price.public += event.price;
        break;
      case `Ship`:
        price.sail += event.price;
        break;
      case `Bus`:
        price.coach += event.price;
        break;
      case `Train`:
        price.transit += event.price;
        break;
      case `Taxi`:
        price.ride += event.price;
        break;
    }
  });

  const nonZeroPriceEventTypes = Object.entries(price).filter((type) => {
    return type[1] > 0;
  });
  const eventsLabels = nonZeroPriceEventTypes.map((type) => {
    return type[0].toUpperCase();
  });
  const eventsData = nonZeroPriceEventTypes.map((type) => {
    return type[1];
  });

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventsLabels,
      datasets: [{
        data: eventsData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (ctx, events) => {
  const transport = {
    fly: 0,
    drive: 0,
    public: 0,
    sail: 0,
    coach: 0,
    transit: 0,
    ride: 0
  };

  events.forEach((event) => {
    switch (event.type.type) {
      case `Flight`:
        transport.fly += 1;
        break;
      case `Drive`:
        transport.drive += 1;
        break;
      case `Transport`:
        transport.public += 1;
        break;
      case `Ship`:
        transport.sail += 1;
        break;
      case `Bus`:
        transport.coach += 1;
        break;
      case `Train`:
        transport.transit += 1;
        break;
      case `Taxi`:
        transport.ride += 1;
        break;
    }
  });

  const nonZeroPriceEventTypes = Object.entries(transport).filter((type) => {
    return type[1] > 0;
  });
  const eventsLabels = nonZeroPriceEventTypes.map((type) => {
    return type[0].toUpperCase();
  });
  const eventsData = nonZeroPriceEventTypes.map((type) => {
    return type[1];
  });

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventsLabels,
      datasets: [{
        data: eventsData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeChart = (ctx, events) => {
  let eventsLabels = [];
  let eventsData = [];
  events.forEach((event) => {
    eventsLabels.push(event.destination);
    const duration = getDuration(event.time);
    const days = parseInt(duration.split(` `)[0].split(`D`)[0], 10);
    const hours = parseInt(duration.split(` `)[1].split(`H`)[0], 10);
    eventsData.push(days * 24 + hours);
  });

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventsLabels,
      datasets: [{
        data: eventsData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val} hours`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const getStatisticsMarkup = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

class Statistics extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._events = events;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return getStatisticsMarkup();
  }

  show() {
    super.show();
    this.rerender(this._events);
  }

  recoveryListeners() {}

  rerender(events) {
    this._events = events;
    super.rerender();
    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCanvas = element.querySelector(`.statistics__chart--money`);
    const moneyCtx = moneyCanvas.getContext(`2d`);
    const transportCanvas = element.querySelector(`.statistics__chart--transport`);
    const transportCtx = transportCanvas.getContext(`2d`);
    const timeSpentCanvas = element.querySelector(`.statistics__chart--time`);
    const timeSpentCtx = timeSpentCanvas.getContext(`2d`);

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpentCtx.height = BAR_HEIGHT * 4;

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._events);
    this._transportChart = renderTransportChart(transportCtx, this._events);
    this._timeChart = renderTimeChart(timeSpentCtx, this._events);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}

export default Statistics;
