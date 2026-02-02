import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing assets
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ProjectMap = ({ data, center, zoom = 9, height = '400px' }) => {
  // Use passed data or fallback to dummy
  const mapCenter = center 
    ? [parseFloat(center[0]), parseFloat(center[1])]
    : [-7.250445, 112.768845];
  
  const markers = data || [
    { id: 1, name: "Project A", lat: -7.250445, lng: 112.768845, status: "On Progress" },
    { id: 2, name: "Project B", lat: -7.285078, lng: 112.781099, status: "Completed" },
    { id: 3, name: "Project C", lat: -7.311456, lng: 112.723412, status: "Pending" },
    { id: 4, name: "Project D", lat: -7.966620, lng: 112.632629, status: "On Progress" }, // Malang
    { id: 5, name: "Project E", lat: -8.670458, lng: 115.212629, status: "Active" }, // Denpasar
  ];

  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 z-0 relative">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, idx) => (
          // Handle various naming conventions (id/order_id, name/project_name/lokasi)
          <Marker 
            key={marker.id || idx} 
            position={[parseFloat(marker.lat || marker.latitude), parseFloat(marker.lng || marker.longitude)]}
          >
            <Popup>
              <div className="font-['Carlito']">
                <h3 className="font-bold text-slate-800">{marker.name || marker.lokasi || 'Project'}</h3>
                <p className="text-slate-600 text-xs">{marker.status || marker.status_name || ''}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ProjectMap;