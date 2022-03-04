import { useState } from 'react';
import DashboardPage from 'pages/DashboardPage';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import NavBar from 'components/NavBar';
import SignUpPage from 'pages/SignUpPage';
import CreateUserPage from 'pages/UserAndAccountManagement/CreateUserPage';
import ListUsersPage from 'pages/UserAndAccountManagement/ListUsersPage';
import UpdateAccountPage from 'pages/UserAndAccountManagement/UpdateAccountPage';
import UpdateUserPage from 'pages/UserAndAccountManagement/UpdateUserPage';
import ViewAccountPage from 'pages/UserAndAccountManagement/ViewAccountPage';
import ViewUserPage from 'pages/UserAndAccountManagement/ViewUserPage';
import UpdateDevicePage from 'pages/LocationManagerPage/UpdateDevicePage';
import ListInfractionEventsPage from 'pages/InfractionEvents/ListInfractionEventsPage';
import ViewInfractionEvent from 'pages/InfractionEvents/ViewInfractionEventPage';
import ListInfractionTypesPage from 'pages/InfractionTypesPage/ListInfractionTypesPage';
import ViewInfractionTypePage from 'pages/InfractionTypesPage/ViewInfractionTypePage';
import CreateInfractionTypePage from 'pages/InfractionTypesPage/CreateInfractionTypePage';
import EditInfractionTypePage from 'pages/InfractionTypesPage/EditInfractionTypePage';
import AddTrainingInfractionPage from 'pages/TrainingPage/AddTrainingInfractionPage';
import ListTrainingInfractionsPage from 'pages/TrainingPage/ListTrainingInfractionsPage';
import TrainInfractionPage from 'pages/TrainingPage/TrainInfractionPage';
import RouteNotFoundPage from 'pages/ErrorPages/RouteNotFoundPage';
import RequireAuth from 'components/RequireAuth';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Container, Spinner } from 'reactstrap';
import { NotificationContainer } from 'react-notifications';
import useAuthInfo from 'hooks/useAuthData';
import useInfractionEventConsumer from 'hooks/useInfractionEventConsumer';
import ListLocationsPage from 'pages/LocationManagerPage/ListLocationsPage';
import AddLocationPage from 'pages/LocationManagerPage/AddLocationPage';
import UpdateLocationPage from 'pages/LocationManagerPage/UpdateLocationPage';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { authInfo, setIsAuthenticated } = useAuthInfo(setIsLoaded);

  useInfractionEventConsumer(authInfo);

  if (!isLoaded) {
    return <Spinner />
  }

  return (
    <div>
      <div>
        <NavBar
          authInfo={authInfo}
          setIsAuthenticated={setIsAuthenticated}
        />
      </div>
      <Container className="py-5 h-100 px-4">
        <Routes>
          <Route
            path="/"
            element={
              authInfo.currentUser ? (
                <RequireAuth authInfo={authInfo}>
                  <DashboardPage />
                </RequireAuth>
              ) : <HomePage authInfo={authInfo} />
            }
          />
          <Route path="login" element={
              <LoginPage
                authInfo={authInfo}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="signup"
            element={
              <SignUpPage setIsAuthenticated={setIsAuthenticated} authInfo={authInfo} />
            }
          />
          <Route path="account" element={<RequireAuth authInfo={authInfo}><Outlet /></RequireAuth>}>
            <Route index element={<ViewAccountPage authInfo={authInfo} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="edit" element={<UpdateAccountPage authInfo={authInfo} />} />
            <Route path="users">
              <Route path="add" element={<CreateUserPage authInfo={authInfo} />} />
              <Route path=":userId/edit" element={<UpdateUserPage setIsAuthenticated={setIsAuthenticated} authInfo={authInfo} />} />
              <Route path=":userId/view" element={<ViewUserPage authInfo={authInfo} />} />
              <Route index element={<ListUsersPage authInfo={authInfo} />} />
            </Route>
          </Route>
          <Route path="location-manager" element={<RequireAuth authInfo={authInfo}><Outlet /></RequireAuth>}>
            <Route path="add" element={<AddLocationPage />} />
            <Route path=":locationId">
              <Route path="edit" element={<UpdateLocationPage />} />
              <Route path="device">
                <Route path=":deviceSerialNumber" element={<UpdateDevicePage/>}/>
              </Route>
            </Route>
            <Route index element={<ListLocationsPage/>}/>
          </Route>
          <Route path="infraction-events" element={<RequireAuth authInfo={authInfo}><Outlet /></RequireAuth>}>
            <Route index element={<ListInfractionEventsPage />} />
            <Route path=":infractionEventId/view" element={<ViewInfractionEvent />} />
          </Route>
          <Route path="training" element={<RequireAuth authInfo={authInfo}><Outlet /></RequireAuth>}>
            <Route path=":deviceId">
              <Route path="add" index element={<AddTrainingInfractionPage />}/>
              <Route path="view" index element={<ListTrainingInfractionsPage />} />
              <Route path=":infractionId">
                <Route path="train" index element={<TrainInfractionPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="infraction-types" element={<RequireAuth authInfo={authInfo}><Outlet /></RequireAuth>}>
            <Route path="add" element={<CreateInfractionTypePage />} />
            <Route path=":infractionTypeId/view" element={<ViewInfractionTypePage />} />
            <Route path=":infractionTypeId/edit" element={<EditInfractionTypePage />} />
            <Route index element={<ListInfractionTypesPage />} />
          </Route>
          <Route
            path="*"
            element={<RouteNotFoundPage />}
          />
        </Routes>
      </Container>
      <NotificationContainer />
    </div>
  );
}
