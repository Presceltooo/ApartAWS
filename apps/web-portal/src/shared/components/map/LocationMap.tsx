import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';

// Fix Leaflet marker icon issues with React/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER: [number, number] = [21.0285, 105.8542];
const DEFAULT_ZOOM = 15;

const MapContainerWrapper = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  width: 100%;
  
  .leaflet-container {
    z-index: 1;
  }
`;

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  height?: string;
  zoom?: number;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  height = '300px',
  zoom = DEFAULT_ZOOM,
}) => {
  const position: [number, number] =
    latitude && longitude ? [latitude, longitude] : DEFAULT_CENTER;

  return (
    <MapContainerWrapper style={{ height }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <ChangeView center={position} zoom={zoom} />
      </MapContainer>
    </MapContainerWrapper>
  );
};
