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
import ListDevicesPage from 'pages/DeviceManagerPage/ListDevicesPage';
import AddDevicePage from 'pages/DeviceManagerPage/AddDevicePage';
import UpdateDevicePage from 'pages/DeviceManagerPage/UpdateDevicePage';
import ListInfractionEventsPage from 'pages/InfractionEvents/ListInfractionEventsPage';
import ViewInfractionEvent from 'pages/InfractionEvents/ViewInfractionEventPage';
import ListInfractionTypesPage from 'pages/InfractionTypesPage/ListInfractionTypesPage';
import CreateInfractionTypePage from 'pages/InfractionTypesPage/CreateInfractionTypePage';
import RequireAuth from 'components/RequireAuth';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Container, Spinner } from 'reactstrap';
import useAuthInfo from 'hooks/useAuthData';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { authInfo, setIsAuthenticated } = useAuthInfo(setIsLoaded);


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
              authInfo.isAuthenticated ? (
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
          <Route path="device-manager" element={<RequireAuth authInfo={authInfo}><Outlet /></RequireAuth>}>
            <Route path="add" element={<AddDevicePage />} />
            <Route path=":deviceId">
              <Route path="edit" element={<UpdateDevicePage />} />
              <Route path="infraction-types" element={<ListInfractionTypesPage />} />
              <Route path="infraction-types/add" element={<CreateInfractionTypePage />} />
            </Route>
            <Route index element={<ListDevicesPage/>}/>
          </Route>
          <Route path="infraction-events" element={<RequireAuth authInfo={authInfo}><Outlet /></RequireAuth>}>
            <Route index element={<ListInfractionEventsPage />} />
            <Route path=":infractionEventId/view" element={<ViewInfractionEvent />} />
          </Route>
        </Routes>
      </Container>
    </div>
  );
}
