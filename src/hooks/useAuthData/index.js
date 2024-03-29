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
      setIsAuthenticated(true);
    }).catch(() => {
      setIsAuthenticated(false);
      setIsLoaded(true);
    });
  }, [setIsLoaded]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/users/me').then((res) => {
        const user = res?.data || null;
        setCurrentUser(user);
        setIsLoaded(true);
      }).catch(() => {
        setCurrentUser(null);
        setIsLoaded(true);
      });
    } else {
      setCurrentUser(null);
    }
  }, [isAuthenticated, setIsLoaded]);

  return {
    authInfo: {
      isAuthenticated,
      isExistingUser,
      currentUser,
    },
    setIsAuthenticated,
  };
}
