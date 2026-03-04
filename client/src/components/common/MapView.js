import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons for different report types
const getIcon = (type) => {
  const colors = {
    outage: '🔴',
    low_voltage: '🟡',
    damaged_line: '⚠️',
    billing: '💰',
    other: '⚪'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="font-size: 24px;">${colors[type] || '⚪'}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Default to Rwanda coordinates
const DEFAULT_CENTER = [-1.9403, 29.8739];
const DEFAULT_ZOOM = 10;

const MapView = ({ 
  reports = [], 
  height = "400px",
  showAll = true,
  center,
  zoom = DEFAULT_ZOOM
}) => {
  // If center is provided, use it; otherwise use default Rwanda center
  const mapCenter = center || DEFAULT_CENTER;
  
  // Calculate center from reports if showAll is true
  const getMapCenter = () => {
    if (center) return center;
    if (reports.length === 0) return DEFAULT_CENTER;
    
    const lats = reports.map(r => r.location?.lat).filter(Boolean);
    const lngs = reports.map(r => r.location?.lng).filter(Boolean);
    
    if (lats.length === 0 || lngs.length === 0) return DEFAULT_CENTER;
    
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    
    return [avgLat, avgLng];
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300" style={{ height }}>
      <MapContainer
        center={getMapCenter()}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => {
          if (!report.location?.lat || !report.location?.lng) return null;
          
          const typeLabels = {
            outage: 'Power Outage',
            low_voltage: 'Low Voltage',
            damaged_line: 'Damaged Line',
            billing: 'Billing Issue',
            other: 'Other'
          };
          
          const statusColors = {
            pending: 'yellow',
            in_progress: 'blue',
            resolved: 'green',
            rejected: 'red'
          };
          
          return (
            <Marker
              key={report._id}
              position={[report.location.lat, report.location.lng]}
              icon={getIcon(report.type)}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{typeLabels[report.type] || 'Report'}</h3>
                  <p className="text-gray-600">{report.description?.substring(0, 100)}...</p>
                  <p className="mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs bg-${statusColors[report.status]}-100 text-${statusColors[report.status]}-800`}>
                      {report.status?.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {report.location.address || 'Location captured'}
                  </p>
                  <p className="text-xs text-gray-500">
                    📅 {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
