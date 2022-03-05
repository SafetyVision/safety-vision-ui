import { useState, useEffect } from 'react';
import axios from 'util/axiosConfig';
import { Spinner } from 'reactstrap';
import ResourceNotFoundPage from 'pages/ErrorPages/ResourceNotFoundPage';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function DashboardPage() {
  const [infractionEvents, setInfractionEvents] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dataArray, setDataArray] = useState({});

  useEffect(() => {
    setIsLoaded(false);
    axios.get('/api/infraction_events/').then((res) => {
      setInfractionEvents(res.data);
      setIsLoaded(true);
      setIsError(false);
      populateDataArray(res.data);
    }).catch(() => {
      setIsError(true);
    });
  }, []);

  const create24HourArray = () => {
    let end = new Date();
    let start = new Date(end.getTime());
    start.setDate(end.getDate() - 1);
    let arr = [];
    let dt = new Date(start);

    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setHours(dt.getHours() + 1);
    }

    return arr;
  }

  const populateDataArray = (infractionEvents) => {
    let dateArr = create24HourArray();
    let data = [];

    for (let date of dateArr) {
      let tempData = infractionEvents.filter((infractionEvent) => {
        let newDate = new Date(infractionEvent.infraction_date_time);
        return (date.getYear() === newDate.getYear() &&
          date.getMonth() === newDate.getMonth() &&
          date.getDate() === newDate.getDate() &&
          date.getHours() === newDate.getHours())
      })
        .reduce((acc, val) => {
          return acc + 1
        }, 0)
      data.push({
        date: date.toString(),
        count: tempData,
      })
    }
    setDataArray(data);
  }

  if (isError) {
    return <ResourceNotFoundPage />;
  }

  if (!isLoaded) {
    return <Spinner />;
  }

  return (
    <div>
      <h1 className="fw-bold">
        Dashboard Page
      </h1>
      <LineChart
        width={750}
        height={500}
        data={dataArray}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 200
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" height={1} interval={11} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}
