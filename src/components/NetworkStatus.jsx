import * as React from 'react';
import {
  useNotifications,
  NotificationsProvider,
} from '@toolpad/core/useNotifications';

function NetworkStatusNotifier() {
  const notifications = useNotifications();
  const [online, setOnline] = React.useState(navigator.onLine);
  const prevOnline = React.useRef(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  React.useEffect(() => {
    if (prevOnline.current === online) return;

    prevOnline.current = online;

    const key = notifications.show(
      online ? 'You are now online' : 'You are now offline',
      {
        severity: online ? 'success' : 'error',
        autoHideDuration: 5000,
      }
    );

    return () => {
      notifications.close(key);
    };
  }, [notifications, online]);

  return null; 
}

export default function ToolpadNetworkNotification() {
  return (
    <NotificationsProvider>
      <NetworkStatusNotifier />
    </NotificationsProvider>
  );
}
