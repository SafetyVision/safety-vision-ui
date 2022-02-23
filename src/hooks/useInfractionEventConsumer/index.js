import { useEffect, useRef } from 'react';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';

export default function useInfractionEventConsumer(authInfo) {
  const sseConnection = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authInfo.currentUser && !sseConnection.current) {
      const sseConnectionEndpoint =`/api/events/?channel=account_${authInfo.currentUser.account}_events`;
      sseConnection.current = new EventSource(sseConnectionEndpoint);
      sseConnection.current.onmessage = (event) => {
        const { infraction_event } = JSON.parse(event.data);
        NotificationManager.info(
          'Click me to view.',
          'New safety infraction detected',
          5000,
          () => { navigate(`infraction-events/${infraction_event}/view`, { replace: true }) }
        );
      }
    }
    if (!authInfo.isAuthenticated && sseConnection.current) {
      sseConnection.current.close();
      sseConnection.current = null;
    }
  }, [authInfo, navigate]);
}