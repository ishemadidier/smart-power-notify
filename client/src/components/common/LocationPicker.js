import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Default to Rwanda coordinates
const DEFAULT_CENTER = [-1.9403, 29.8739];
const DEFAULT_ZOOM = 12;

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const LocationPicker = ({ 
  position, 
  onLocationChange, 
  showAddress = true,
  height = "300px" 
}) => {
  const [currentPosition, setCurrentPosition] = useState(position || DEFAULT_CENTER);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Get current location on mount
  useEffect(() => {
    if (!position && navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
          if (onLocationChange) {
            onLocationChange({ lat: latitude, lng: longitude });
          }
          reverseGeocode(latitude, longitude);
          setLoading(false);
        },
        (err) => {
          console.log('Geolocation error:', err);
          setLoading(false);
        }
      );
    }
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free, no API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.log('Reverse geocoding error:', error);
    }
  };

  const handlePositionChange = (newPos) => {
    setCurrentPosition(newPos);
    if (onLocationChange) {
      onLocationChange({ lat: newPos[0], lng: newPos[1] });
    }
    reverseGeocode(newPos[0], newPos[1]);
  };

  return (
    <div className="location-picker">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (navigator.geolocation) {
              setLoading(true);
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const { latitude, longitude } = pos.coords;
                  setCurrentPosition([latitude, longitude]);
                  if (onLocationChange) {
                    onLocationChange({ lat: latitude, lng: longitude });
                  }
                  reverseGeocode(latitude, longitude);
                  setLoading(false);
                },
                (err) => {
                  console.log('Geolocation error:', err);
                  setLoading(false);
                }
              );
            }
          }}
          className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
        >
          {loading ? 'Getting location...' : '📍 Get My Location'}
        </button>
      </div>
      
      <div 
        className="rounded-lg overflow-hidden border border-gray-300" 
        style={{ height }}
      >
        <MapContainer
          center={currentPosition}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={currentPosition} 
            setPosition={handlePositionChange} 
          />
          <RecenterMap center={currentPosition} />
        </MapContainer>
      </div>

      {showAddress && address && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
          <span className="font-medium">📍 Address: </span>
          {address}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
