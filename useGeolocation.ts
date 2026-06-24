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
      console.error("La geolocalización no es soportada por este navegador.");
      // No se puede instanciar GeolocationPositionError directamente.
      // Usamos un objeto de error personalizado o un mensaje.
      const customError = { code: 0, message: "Geolocation not supported" } as GeolocationPositionError;
      setState(s => ({ ...s, loading: false, error: customError }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({ loading: false, error: null, data: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
    };

    const onError = (error: GeolocationPositionError) => {
      // Si hay un error, debemos poner loading en false para que la UI reaccione.
      setState({ loading: false, error, data: null });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
  }, []);

  return state;
};