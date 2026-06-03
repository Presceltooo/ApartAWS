import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { Input, Select, Space, Button, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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

// Hanoi coords
const DEFAULT_CENTER: [number, number] = [21.0285, 105.8542];
const DEFAULT_ZOOM = 13;

const MapContainerWrapper = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
  position: relative;
  
  .leaflet-container {
    z-index: 1;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 12px;
`;

interface LocationPickerProps {
  value?: { latitude?: number; longitude?: number };
  onChange?: (val: { latitude: number; longitude: number }) => void;
  height?: string;
}

// Sub-component to handle map centering and flyTo
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Sub-component to handle map click events
function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  height = '350px',
}) => {
  const lat = value?.latitude;
  const lng = value?.longitude;

  const [position, setPosition] = useState<[number, number]>(
    lat && lng ? [lat, lng] : DEFAULT_CENTER
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync state with value prop
  useEffect(() => {
    if (lat && lng) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const handleMapClick = (newLat: number, newLng: number) => {
    const roundedLat = parseFloat(newLat.toFixed(6));
    const roundedLng = parseFloat(newLng.toFixed(6));
    setPosition([roundedLat, roundedLng]);
    if (onChange) {
      onChange({ latitude: roundedLat, longitude: roundedLng });
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
      if (data.length > 0) {
        // Automatically select the first result
        const first = data[0];
        const newLat = parseFloat(first.lat);
        const newLng = parseFloat(first.lon);
        handleMapClick(newLat, newLng);
      }
    } catch (error) {
      console.error('Error fetching geocoding results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (val: string) => {
    const selected = searchResults.find((item) => item.place_id.toString() === val);
    if (selected) {
      const newLat = parseFloat(selected.lat);
      const newLng = parseFloat(selected.lon);
      handleMapClick(newLat, newLng);
    }
  };

  return (
    <div>
      <SearchContainer>
        <Space.Compact style={{ width: '100%' }}>
          <Input.Search
            placeholder="Tìm kiếm địa điểm trên bản đồ..."
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            enterButton={<Button type="primary" icon={<SearchOutlined />} loading={loading}>Tìm</Button>}
          />
        </Space.Compact>
        {searchResults.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn kết quả chính xác hơn..."
              onChange={handleSelectResult}
              options={searchResults.map((item) => ({
                label: item.display_name,
                value: item.place_id.toString(),
              }))}
            />
          </div>
        )}
      </SearchContainer>

      <Alert
        message="Nhấp chuột vào bản đồ để chọn vị trí chính xác của căn hộ."
        type="info"
        showIcon
        style={{ marginBottom: '8px' }}
      />

      <MapContainerWrapper style={{ height }}>
        <MapContainer
          center={position}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />
          <ChangeView center={position} />
          <MapEvents onMapClick={handleMapClick} />
        </MapContainer>
      </MapContainerWrapper>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
        Tọa độ đã chọn: <strong>{position[0]}</strong>, <strong>{position[1]}</strong>
      </div>
    </div>
  );
};
