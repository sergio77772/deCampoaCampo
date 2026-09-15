import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOnline, setOffline } from '../features/connection/connectionSlice';

/**
 * Hook que sincroniza el estado online/offline del navegador con Redux.
 * Registra event listeners en mount y los limpia en unmount.
 */
const useOnlineStatus = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOnline = () => dispatch(setOnline());
    const handleOffline = () => dispatch(setOffline());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);
};

export default useOnlineStatus;
