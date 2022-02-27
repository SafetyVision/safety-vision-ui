import getCookie from 'util/cookies';
import axios from 'util/axiosConfig';
import { useEffect, useState } from 'react';

export default function useAuthData(setIsLoaded) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const isExistingUser = getCookie('sessionid') !== null;

  useEffect(() => {
    axios.get('/api/set-csrf/');
    axios.get('/api/test-auth/').then(() => {
      axios.get('/api/users/me').then((res) => {
        const user = res?.data || null;
        setCurrentUser(user);
        setIsAuthenticated(true);
        setIsLoaded(true);
      }).catch((res) => {
        setIsAuthenticated(false);
        setIsLoaded(true);
      });
    }).catch(() => {
      setIsAuthenticated(false);
      setIsLoaded(true);
    });
  }, [setIsLoaded]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(null);
    }
  }, [isAuthenticated]);

  return {
    authInfo: {
      isAuthenticated,
      isExistingUser,
      currentUser,
    },
    setIsAuthenticated,
  };
}
