import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | null;
  data: {
    latitude: number;
    longitude: number;
  } | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, loading: false, error: new GeolocationPositionError() }));
      console.error("La geolocalización no es soportada por este navegador.");
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({ loading: false, error: null, data: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({ loading: true, error, data: null });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
  }, []);

  return state;
};