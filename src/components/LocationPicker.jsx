import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
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

// Component to handle map clicks
function LocationMarker({ position, onLocationChange, locked }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (!locked) {
        onLocationChange(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
      }
    },
  });

  // Update map view when position changes externally
  useEffect(() => {
      const lat = parseFloat(position?.[0]);
      const lng = parseFloat(position?.[1]);
      
      if (!isNaN(lat) && !isNaN(lng)) {
          map.flyTo([lat, lng], map.getZoom());
      }
  }, [position, map]);

  const markerPos = useMemo(() => {
    const lat = parseFloat(position?.[0]);
    const lng = parseFloat(position?.[1]);
    return (!isNaN(lat) && !isNaN(lng)) ? [lat, lng] : null;
  }, [position]);

  return markerPos === null ? null : (
    <Marker position={markerPos}></Marker>
  );
}

const LocationPicker = ({ lat, lng, onLocationChange, locked }) => {
  // Default to Surabaya if no coords provided
  const defaultCenter = [-7.250445, 112.768845];
  
  const handleMyLocation = () => {
    if (locked) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        onLocationChange(position.coords.latitude.toFixed(6), position.coords.longitude.toFixed(6));
      }, (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Use a fixed center for initialization to avoid constant re-centering if props are invalid
  return (
    <div className="h-60 w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 z-0 relative group">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={!locked} 
        dragging={!locked}
        doubleClickZoom={!locked}
        style={{ height: '100%', width: '100%', cursor: locked ? 'default' : 'crosshair' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
            position={[lat, lng]} 
            onLocationChange={onLocationChange} 
            locked={locked}
        />
      </MapContainer>
      
      {/* Map Controls Overlay */}
      {!locked && (
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
           <button 
             onClick={handleMyLocation}
             type="button"
             className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
             title="My Location"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
             </svg>
           </button>
        </div>
      )}
      
      {locked && (
        <div className="absolute inset-0 bg-slate-100/10 z-[1000] flex items-center justify-center pointer-events-none">
           <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span className="text-xs font-bold text-slate-600">Map Locked</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;