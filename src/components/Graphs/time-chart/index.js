import { useEffect, useState } from "react";
import axios from "util/axiosConfig";
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function FakeData() {
  let mockInfractionEvents = [];
  let date = new Date();
  for (let i = 0; i < 100; i++) {
    // Append new event to infractionEvents array
    let infractionEvent = {
      "id": i + 1,
      "account": 1,
      "infraction_video": {
        "file": "https://safety-vision-static-files.s3.localhost:4566/media/Maximus_Minimus.jpg"
      },
      "infraction_date_time": `2022-02-${date.getDate() - (getRandomInt(7))}`,
      "location": "Location " + (getRandomInt(5) + 1).toString()
    }
    mockInfractionEvents.push(infractionEvent);
  }
  console.log("FakeData(): ", mockInfractionEvents)
  return mockInfractionEvents;
}

export default function TimeChart() {
  const [infractionEvents, setInfractionEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/infraction_events/').then((res) => {
      console.log(res.data);
      setInfractionEvents(FakeData());
      console.log(`infractionEvents: ${infractionEvents}`);
    });
  }, []);

  return (
    <div>
      {
        Object.keys(infractionEvents).map((key) =>
          <div key={key}>
            <p>id: {infractionEvents[key].id}</p>
            <p>account: {infractionEvents[key].account}</p>
            <p>infraction_date_time: {infractionEvents[key].infraction_date_time}</p>
            <p>location: {infractionEvents[key].location}</p>
          </div>
        )
      }

      <AreaChart width={730} height={250} data={infractionEvents}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="location" stroke="#8884d8" fillOpacity={1} />
      </AreaChart>
    </div>
  )
}
