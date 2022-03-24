import  { useState, useEffect } from 'react';
import axios from 'util/axiosConfig';
import { Table, Spinner, Button, Input, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import formatTimestamp from 'util/dates';
import ResourceNotFoundPage from 'pages/ErrorPages/ResourceNotFoundPage';

const FILTER_OPTIONS = {
  location: {
    filterKey: 'location',
    displayName: 'Location',
    displayNameKey: 'description',
  },
  infractionType: {
    filterKey: 'infraction_type',
    displayName: 'Infraction Type',
    displayNameKey: 'infraction_type_name',
  },
  noFilter: {
    filterKey: null,
    displayName: 'No Filter',
    displayNameKey: null,
  },
}

export default function ListInfractionEventsPage() {
  const [infractionEvents, setInfractionEvents] = useState(null);
  const [allInfractionEvents, setAllInfractionEvents] = useState(null);
  const [isError, setIsError] = useState(false);
  const [filter, setFilter] = useState("noFilter");
  const [selectedFilterValue, setSelectedFilterValue] = useState("none");
  const [possibleFilterValues, setPossibleFilterValues] = useState({});

  useEffect(() => {
    axios.get('/api/infraction_events/').then((res) => {
      setAllInfractionEvents(res.data);
    }).catch(() => {
      setIsError(true);
    });
    axios.get('/api/locations/').then((res) => {
      setPossibleFilterValues(possibleFilterValues => ({
        ...possibleFilterValues,
        [FILTER_OPTIONS.location.filterKey]: res.data,
      }));
    }).catch(() => {
      setIsError(true);
    });
    axios.get('/api/infraction_types/').then((res) => {
      setPossibleFilterValues(possibleFilterValues => ({
        ...possibleFilterValues,
        [FILTER_OPTIONS.infractionType.filterKey]: res.data,
      }));
    }).catch(() => {
      setIsError(true);
    });
  }, []);

  useEffect(() => {
    const filterObject = FILTER_OPTIONS[filter];
    if (!filterObject.filterKey || selectedFilterValue === "none") setInfractionEvents(allInfractionEvents);
    else {
      setInfractionEvents(
        allInfractionEvents.filter(event => `${event[filterObject.filterKey].id}` === selectedFilterValue)
      );
    }
  }, [selectedFilterValue, filter, allInfractionEvents])

  const mapInfractionEventToTableRow = (infractionEvent) => (
    <tr key={infractionEvent.id}>
      <td className="align-middle">
        {infractionEvent.id}
      </td>
      <td className="align-middle">
        <Link to={`/locations/${infractionEvent.location.id}/view`} className="text-decoration-none">
          {infractionEvent.location.description}
        </Link>
      </td>
      <td className="align-middle">
        <Link to={`/infraction-types/${infractionEvent.infraction_type.id}/view`} className="text-decoration-none">
          {infractionEvent.infraction_type.infraction_type_name}
        </Link>
      </td>
      <td className="align-middle">
        {formatTimestamp(infractionEvent.infraction_date_time)}
      </td>
      <td className="text-end align-middle">
        <Button className="w-100" color="primary" tag={Link} to={`/infraction-events/${infractionEvent.id}/view`}>
          View
        </Button>
      </td>
    </tr>
  );

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setSelectedFilterValue("none");
  }

  if (isError) {
    return <ResourceNotFoundPage />;
  }

  if (
    !infractionEvents ||
    !possibleFilterValues[FILTER_OPTIONS.location.filterKey] ||
    !possibleFilterValues[FILTER_OPTIONS.infractionType.filterKey]
  ) {
    return <Spinner />;
  }

  return (
    <div>
      <h1 className="fw-bold">
        Infraction Events
      </h1>
      <FormGroup>
        <Label>Filter By:</Label>
        <Input
          name="filter-selector"
          id="filter-selector"
          type="select"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="noFilter">
            {FILTER_OPTIONS.noFilter.displayName}
          </option>
          <option value="location">
            {FILTER_OPTIONS.location.displayName}
          </option>
          <option value="infractionType">
            {FILTER_OPTIONS.infractionType.displayName}
          </option>
        </Input>
      </FormGroup>
      {
        FILTER_OPTIONS[filter].filterKey && (
          <FormGroup>
            <Label>{`Select ${FILTER_OPTIONS[filter].displayName}:`}</Label>
            <Input
              type="select"
              value={selectedFilterValue}
              onChange={e => setSelectedFilterValue(e.target.value)}
            >
              <option
                value="none"
              >
                {`Select ${FILTER_OPTIONS[filter].displayName}...`}
              </option>
              {
                possibleFilterValues[FILTER_OPTIONS[filter].filterKey].map(filterValue => (
                  <option
                    value={filterValue.id}
                    key={`${filter}${filterValue.id}`}
                  >
                    {filterValue[FILTER_OPTIONS[filter].displayNameKey]}
                  </option>
                ))
              }
            </Input>
          </FormGroup>
        )
      }
      {
        infractionEvents?.length ? (
          <Table striped borderless responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Infraction Type</th>
                <th>Infraction Time</th>
                <th />
              </tr>
            </thead>
            <tbody className="border-top border-bottom">
              {infractionEvents.map(mapInfractionEventToTableRow)}
            </tbody>
          </Table>
        ) : (
          <p>No infraction events to show.</p>
        )
      }
    </div>
  );
}
