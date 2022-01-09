import { useState } from 'react';
import DashboardPage from 'pages/DashboardPage';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import NavBar from 'components/NavBar';
import SignUpPage from 'pages/SignUpPage';
import UserAndAccountManagementPage from 'pages/UserAndAccountManagementPage';
import CreateUserPage from 'pages/UserAndAccountManagementPage/CreateUserPage';
import ListUsersPage from 'pages/UserAndAccountManagementPage/ListUsersPage';
import UpdateAccountPage from 'pages/UserAndAccountManagementPage/UpdateAccountPage';
import UpdateUserPage from 'pages/UserAndAccountManagementPage/UpdateUserPage';
import ViewAccountPage from 'pages/UserAndAccountManagementPage/ViewAccountPage';
import ViewUserPage from 'pages/UserAndAccountManagementPage/ViewUserPage';
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
      <Container className="pt-5 h-100 px-4">
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
            <Route index element={<UserAndAccountManagementPage authInfo={authInfo} />} />
            <Route path="view" element={<ViewAccountPage authInfo={authInfo} />} />
            <Route path="edit" element={<UpdateAccountPage authInfo={authInfo} />} />
            <Route path="users">
              <Route path="add" element={<CreateUserPage />} />
              <Route path=":userId/edit" element={<UpdateUserPage />} />
              <Route path=":userId/view" element={<ViewUserPage />} />
              <Route index element={<ListUsersPage />} />
            </Route>
          </Route>
        </Routes>
      </Container>
    </div>
  );
}
