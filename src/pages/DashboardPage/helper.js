import formatTimestamp from "util/dates";

export const overTimeGraph = (timeSpan, infractionEvents) => {
  let dateArr = [];
  let data = [];
  if (timeSpan === "today") {
    dateArr = create24HourArray();
    dateArr.forEach((date) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            date.getYear() === newDate.getYear() &&
            date.getMonth() === newDate.getMonth() &&
            date.getDate() === newDate.getDate() &&
            date.getHours() === newDate.getHours()
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        date: formatTimestamp(date, timeSpan),
        'Number of Infractions': tempData,
      });
    });
  } else if (timeSpan === "week") {
    dateArr = createWeekArray();
    dateArr.forEach((date) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            date.getYear() === newDate.getYear() &&
            date.getMonth() === newDate.getMonth() &&
            date.getDate() === newDate.getDate()
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        date: formatTimestamp(date, timeSpan),
        'Number of Infractions': tempData,
      });
    });
  } else if (timeSpan === "month") {
    dateArr = createMonthArray();
    dateArr.forEach((date) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            date.getYear() === newDate.getYear() &&
            date.getMonth() === newDate.getMonth() &&
            date.getDate() === newDate.getDate()
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        date: formatTimestamp(date, timeSpan),
        'Number of Infractions': tempData,
      });
    });
  } else if (timeSpan === "year") {
    dateArr = createYearArray();
    dateArr.forEach((date) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            date.getYear() === newDate.getYear() &&
            date.getMonth() === newDate.getMonth()
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        date: formatTimestamp(date, timeSpan),
        'Number of Infractions': tempData,
      });
    });
  }
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

  if (timeSpan === "today") {
    locationArr.forEach((location) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            today.getYear() === newDate.getYear() &&
            today.getMonth() === newDate.getMonth() &&
            today.getDate() === newDate.getDate() &&
            location === infractionEvent.location.description
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        location: location,
        'Number of Infractions': tempData,
      });
    });
  } else if (timeSpan === "week") {
    let pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);
    locationArr.forEach((location) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            newDate >= pastDate &&
            newDate <= today &&
            location === infractionEvent.location.description
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        location: location,
        'Number of Infractions': tempData,
      });
    });
  } else if (timeSpan === "month") {
    let pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);
    locationArr.forEach((location) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            newDate >= pastDate &&
            newDate <= today &&
            location === infractionEvent.location.description
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        location: location,
        'Number of Infractions': tempData,
      });
    });
  } else if (timeSpan === "year") {
    let pastDate = new Date();
    pastDate.setDate(today.getDate() - 365);
    locationArr.forEach((location) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            newDate >= pastDate &&
            newDate <= today &&
            location === infractionEvent.location.description
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        location: location,
        'Number of Infractions': tempData,
      });
    });
  }
  return data;
};

export const byTypeGraph = (timeSpan, infractionEvents) => {
  const typeArr = [
    ...new Set(
      infractionEvents.map(
        (infractionEvent) => infractionEvent.infraction_type.infraction_type_name
      )
    ),
  ];
  let data = [];
  const today = new Date();

  if (timeSpan === "today") {
    typeArr.forEach((type) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            today.getYear() === newDate.getYear() &&
            today.getMonth() === newDate.getMonth() &&
            today.getDate() === newDate.getDate() &&
            type === infractionEvent.infraction_type.infraction_type_name
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        type: type,
        'Number of Infractions': tempData,
      });
    });
  } else if (timeSpan === "week") {
    let pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);
    typeArr.forEach((type) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            newDate >= pastDate &&
            newDate <= today &&
            type === infractionEvent.infraction_type.infraction_type_name
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        type: type,
        'Number of Infractions': tempData,
      });
    });
  } else if (timeSpan === "month") {
    let pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);
    typeArr.forEach((type) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            newDate >= pastDate &&
            newDate <= today &&
            type === infractionEvent.infraction_type.infraction_type_name
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        type: type,
        'Number of Infractions': tempData,
      });
    });
  } else if (timeSpan === "year") {
    let pastDate = new Date();
    pastDate.setDate(today.getDate() - 365);
    typeArr.forEach((type) => {
      const tempData = infractionEvents
        .filter((infractionEvent) => {
          let newDate = new Date(
            infractionEvent.infraction_date_time.replace("Z", "")
          );
          return (
            newDate >= pastDate &&
            newDate <= today &&
            type === infractionEvent.infraction_type.infraction_type_name
          );
        })
        .reduce((acc) => acc + 1, 0);
      data.push({
        type: type,
        'Number of Infractions': tempData,
      });
    });
  }
  return data;
};

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
