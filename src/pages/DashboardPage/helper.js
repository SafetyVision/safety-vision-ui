import formatTimestamp from "util/dates";

const create24HourArray = () => {
  let dates = [];

  for (let i = 0; i <= 24; i++) {
    let tempDate = new Date();
    tempDate.setHours(i, 0, 0, 0);
    dates.push(tempDate);
  }
  return dates;
};

const createWeekArray = () => {
  let dates = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    let tempDate = new Date();
    tempDate.setDate(today.getDate() - i);
    dates.push(tempDate);
  }
  return dates;
};

const createMonthArray = () => {
  let dates = [];
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    let tempDate = new Date();
    tempDate.setDate(today.getDate() - i);
    dates.push(tempDate);
  }
  return dates;
};

const createYearArray = () => {
  let dates = [];
  const today = new Date();

  for (let i = 12; i >= 0; i--) {
    let tempDate = new Date();
    tempDate.setMonth(today.getMonth() - i);
    dates.push(tempDate);
  }
  return dates;
};

const mapTimeSpanToTimeFilterFunction = {
  today: (date, newDate) =>
    date.getYear() === newDate.getYear() &&
    date.getMonth() === newDate.getMonth() &&
    date.getDate() === newDate.getDate() &&
    date.getHours() === newDate.getHours(),
  week: (date, newDate) =>
    date.getYear() === newDate.getYear() &&
    date.getMonth() === newDate.getMonth() &&
    date.getDate() === newDate.getDate(),
  month: (date, newDate) =>
    date.getYear() === newDate.getYear() &&
    date.getMonth() === newDate.getMonth() &&
    date.getDate() === newDate.getDate(),
  year: (date, newDate) =>
    date.getYear() === newDate.getYear() &&
    date.getMonth() === newDate.getMonth(),
};

const mapTimeSpanToCreateArrayFunction = {
  today: create24HourArray,
  week: createWeekArray,
  month: createMonthArray,
  year: createYearArray,
};

const mapTimeSpanToDaysInt = {
  today: 1,
  week: 7,
  month: 30,
  year: 365,
};

export const overTimeGraph = (timeSpan, infractionEvents) => {
  let dateArr = mapTimeSpanToCreateArrayFunction[timeSpan]();
  let data = [];

  dateArr.forEach((date) => {
    const tempData = infractionEvents
      .filter((infractionEvent) => {
        let newDate = new Date(infractionEvent.infraction_date_time);
        return mapTimeSpanToTimeFilterFunction[timeSpan](date, newDate);
      })
      .reduce((acc) => acc + 1, 0);
    data.push({
      date: formatTimestamp(date, timeSpan),
      "Number of Infractions": tempData,
    });
  });

  return data;
};

export const byLocationGraph = (timeSpan, infractionEvents) => {
  const locationArr = [
    ...new Set(
      infractionEvents.map(
        (infractionEvent) => infractionEvent.location.description
      )
    ),
  ];
  let data = [];
  const today = new Date();
  let pastDate = new Date();
  pastDate.setDate(today.getDate() - mapTimeSpanToDaysInt[timeSpan]);

  locationArr.forEach((location) => {
    const tempData = infractionEvents
      .filter((infractionEvent) => {
        let newDate = new Date(infractionEvent.infraction_date_time);
        return (
          newDate >= pastDate &&
          newDate <= today &&
          location === infractionEvent.location.description
        );
      })
      .reduce((acc) => acc + 1, 0);
    data.push({
      location: location,
      "Number of Infractions": tempData,
    });
  });

  return data;
};

export const byTypeGraph = (timeSpan, infractionEvents) => {
  const typeArr = [
    ...new Set(
      infractionEvents.map(
        (infractionEvent) =>
          infractionEvent.infraction_type.infraction_type_name
      )
    ),
  ];
  let data = [];
  const today = new Date();
  let pastDate = new Date();
  pastDate.setDate(today.getDate() - mapTimeSpanToDaysInt[timeSpan]);

  typeArr.forEach((type) => {
    const tempData = infractionEvents
      .filter((infractionEvent) => {
        let newDate = new Date(infractionEvent.infraction_date_time);
        return (
          newDate >= pastDate &&
          newDate <= today &&
          type === infractionEvent.infraction_type.infraction_type_name
        );
      })
      .reduce((acc) => acc + 1, 0);
    data.push({
      type: type,
      "Number of Infractions": tempData,
    });
  });

  return data;
};

export const movingAverageGraph = (timeSpan, infractionEvents) => {
  let movingAverage = [];
  const k = timeSpan === "year" ? 3 : 5;
  const n = Math.floor(k / 2);

  let dateArr = createMovingAverageTimeArray(timeSpan, n);
  let data = [];

  dateArr.forEach((date) => {
    const tempData = infractionEvents
      .filter((infractionEvent) => {
        let newDate = new Date(infractionEvent.infraction_date_time);
        return mapTimeSpanToTimeFilterFunction[timeSpan](date, newDate);
      })
      .reduce((acc) => acc + 1, 0);
    data.push({
      date: formatTimestamp(date, timeSpan),
      "Number of Infractions": tempData,
    });
  });

  data.forEach((point, index) => {
    if (index >= n && index < data.length - n) {
      movingAverage.push({
        date: point.date,
        "Moving Average": calculateMA(data, index, n, k),
      });
    }
  });
  return movingAverage;
};

const createMovingAverageTimeArray = (timeSpan, n) => {
  let dates = [];
  const today = new Date();

  if (timeSpan === "month") {
    for (let i = 30 + n; i >= 0; i--) {
      let tempDate = new Date();
      tempDate.setDate(today.getDate() - i);
      dates.push(tempDate);
    }
  } else if (timeSpan === "year") {
    for (let i = 12 + n; i >= 0; i--) {
      let tempDate = new Date();
      tempDate.setMonth(today.getMonth() - i);
      dates.push(tempDate);
    }
  }

  return dates;
};

const calculateMA = (data, i, n, k) => {
  const arr = data
    .map((d) => d["Number of Infractions"])
    .slice(i - n, i + n + 1);
  const testArray = data.slice(i - n, i + n + 1);
  let movingAverage = 0;
  movingAverage = arr.reduce((sum, n) => sum + n, 0);

  movingAverage = movingAverage / k;

  return movingAverage;
};
