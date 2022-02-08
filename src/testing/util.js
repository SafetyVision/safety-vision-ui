import { createMemoryHistory } from 'history';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { render } from '@testing-library/react';

const LocationDisplay = () => {
  const location = useLocation()

  return <div data-testid="location-display">{`Current location: ${location.pathname}`}</div>
}

const renderWithRouter = (ui, {route = '/'} = {}) => {
  const history = createMemoryHistory();
  history.push('/login');
  return render(
    <BrowserRouter history={history}>
      <Routes>
        <Route path={route} element={ui} />
        <Route path="*" element={<LocationDisplay />} />
      </Routes>
    </BrowserRouter>
  );
};

export default renderWithRouter;
