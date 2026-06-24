import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import { HEALTH_CENTERS } from '../data/healthUnits';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- INICIO DE LA MODIFICACIÓN ---

// Coordenadas de respaldo (Granada, Nicaragua) si el GPS falla o es denegado.
const FALLBACK_LOCATION = {
  latitude: 11.9344,
  longitude: -85.956,
};

// Configuración para el ícono del marcador (soluciona un problema común con Leaflet y React)
const icon = L.icon({ 
    iconUrl: "/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const MedicalCentersMap: React.FC = () => {
  // 1. Usamos el hook de geolocalización que creamos.
  const { loading, error, data: userLocation } = useGeolocation();

  // 2. Determinamos la ubicación inicial del mapa.
  // Si la geolocalización está cargando o falló, usamos Granada.
  // Si tuvo éxito, usamos las coordenadas del usuario.
  const mapCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [FALLBACK_LOCATION.latitude, FALLBACK_LOCATION.longitude];

  if (loading) {
    return <div className="flex justify-center items-center h-96">Cargando mapa y ubicación...</div>;
  }

  if (error) {
    console.warn("Error de geolocalización:", error.message);
    // Podríamos mostrar un mensaje al usuario aquí.
  }

  return (
    <MapContainer center={mapCenter} zoom={14} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marcador para la ubicación del usuario */}
      {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={icon}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>
      )}

      {/* Mapeamos y mostramos todos los centros de salud */}
      {HEALTH_CENTERS.filter(center => center.latitude && center.longitude).map(center => (
        <Marker key={center.id} position={[center.latitude!, center.longitude!]} icon={icon}>
          <Popup>{center.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MedicalCentersMap;