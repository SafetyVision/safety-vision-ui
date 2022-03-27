import { useState, useEffect } from "react";
import axios from "util/axiosConfig";
import { Spinner, Button, FormGroup, Label, Input } from "reactstrap";
import { overTimeGraph, byLocationGraph, byTypeGraph, movingAverageGraph } from "./helper";
import ResourceNotFoundPage from "pages/ErrorPages/ResourceNotFoundPage";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [infractionEvents, setInfractionEvents] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [timeSpan, setTimeSpan] = useState("today");
  const [graphType, setGraphType] = useState("overTime");

  useEffect(() => {
    if (infractionEvents === null) {
      setIsLoaded(false);
      axios
        .get("/api/infraction_events/")
        .then((res) => {
          setIsLoaded(true);
          setIsError(false);
          setInfractionEvents(res.data);
        })
        .catch(() => {
          setIsError(true);
        });
    }
  }, [infractionEvents]);

  useEffect(() => {
    if (infractionEvents !== null && graphType === "overTime") {
      setDataArray(overTimeGraph(timeSpan, infractionEvents));
    } else if (infractionEvents !== null && graphType === "byLocation") {
      setDataArray(byLocationGraph(timeSpan, infractionEvents));
    } else if (infractionEvents !== null && graphType === "byType") {
      setDataArray(byTypeGraph(timeSpan, infractionEvents));
    } else if (
      infractionEvents !== null &&
      graphType === "movingAverage" &&
      (timeSpan === "today" || timeSpan === "week")
    ) {
      setTimeSpan("month");
    } else if (
      infractionEvents !== null &&
      graphType === "movingAverage" &&
      (timeSpan === "month" || timeSpan === "year")
    ) {
      setDataArray(movingAverageGraph(timeSpan, infractionEvents));
    }
  }, [timeSpan, infractionEvents, graphType]);

  if (isError) {
    return <ResourceNotFoundPage />;
  }

  if (!isLoaded) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center pb-4">
        <h1 className="fw-bold">Dashboard Page</h1>
        <div className="d-flex pb-4">
          <Button
            className="rounded-0"
            color={timeSpan === "today" ? "primary" : "secondary"}
            onClick={() => setTimeSpan("today")}
            disabled={graphType === "movingAverage"}
          >
            Today
          </Button>
          <Button
            className="rounded-0"
            color={timeSpan === "week" ? "primary" : "secondary"}
            onClick={() => setTimeSpan("week")}
            disabled={graphType === "movingAverage"}
          >
            Last Week
          </Button>
          <Button
            className="rounded-0"
            color={timeSpan === "month" ? "primary" : "secondary"}
            onClick={() => setTimeSpan("month")}
          >
            Last Month
          </Button>
          <Button
            className="rounded-0"
            color={timeSpan === "year" ? "primary" : "secondary"}
            onClick={() => setTimeSpan("year")}
          >
            Last Year
          </Button>
          {/* <Button className="rounded-0" color={timeSpan === "all" ? "primary" : "secondary"} onClick={() => setTimeSpan("all")} >
            All Time
          </Button> */}
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center pb-4">
        <FormGroup>
          <Label>Displaying Graph:</Label>
          <Input
            value={graphType}
            onChange={(e) => setGraphType(e.target.value.trim())}
            placeholder="Select a graph type"
            type="select"
          >
            <option key={"overTime"} value="overTime">
              Number of Infractions Over Time
            </option>
            <option key={"byLocation"} value="byLocation">
              Number of Infractions Grouped by Location
            </option>
            <option key={"byType"} value="byType">
              Number of Infractions Grouped by Type of Infraction
            </option>
            <option key={"movingAverage"} value="movingAverage">
              Infraction Moving Average
            </option>
          </Input>
        </FormGroup>
      </div>
      <div style={{ width: "100%", height: 800 }}>
        <ResponsiveContainer width="100%">
          {(graphType === "overTime" && (
            <LineChart
              data={dataArray}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 200,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                height={1}
                interval={timeSpan === "week" ? 0 : timeSpan === "year" ? 1 : 3}
              />
              <YAxis />
              <Tooltip />
              <Line
                strokeWidth={1}
                type="monotone"
                dataKey="Number of Infractions"
                stroke="#82ca9d"
              />
            </LineChart>
          )) ||
            (graphType === "byLocation" && (
              <BarChart
                data={dataArray}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 200,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" height={1} interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Number of Infractions" fill="#82ca9d" barSize={100} />
              </BarChart>
            )) ||
            (graphType === "byType" && (
              <BarChart
                data={dataArray}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 200,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" height={1} interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Number of Infractions" fill="#82ca9d" barSize={100} />
              </BarChart>
            )) ||
            (graphType === "movingAverage" && (
              <LineChart
                data={dataArray}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 200,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  height={1}
                  interval={timeSpan === "month" ? 3 : 1}
                />
                <YAxis />
                <Tooltip />
                <Line
                  strokeWidth={1}
                  type="monotone"
                  dataKey="Moving Average"
                  stroke="#82ca9d"
                />
              </LineChart>
            ))}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
