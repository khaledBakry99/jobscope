import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Función para obtener calles desde Overpass API
async function fetchStreetsInRadius(lat, lng, radius) {
  try {
    // Overpass QL: consulta para obtener calles (highway) dentro de un radio
    const query = `
      [out:json];
      way["highway"]["name"](around:${radius * 1000},${lat},${lng});
      out tags;
    `;
    const url = "https://overpass-api.de/api/interpreter";
    const res = await fetch(url, {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // Verificar la estructura de datos
    if (!data || !Array.isArray(data.elements)) {
      console.error("Invalid data structure from Overpass API:", data);
      return [];
    }

    // Extraer nombres de calles únicos
    const names = Array.from(
      new Set(
        data.elements
          .filter((el) => el.tags && el.tags.name)
          .map((el) => el.tags.name.trim())
      )
    );

    return names;
  } catch (error) {
    console.error("Error fetching streets:", error);
    return [];
  }
}

// Fix for default marker icon issue in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// مكون لتحريك الخريطة إلى موقع معين
function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 13, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [map, position]);

  return null;
}

// مكون للتعامل مع أحداث النقر على الخريطة
function LocationMarker({ position, setPosition, onLocationChange }) {
  const map = useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      if (onLocationChange) {
        onLocationChange(newPos);
      }
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

const SimpleLeafletMap = ({
  center = { lat: 33.5138, lng: 36.2765 }, // Damascus, Syria
  radius = 5,
  height = "300px",
  onLocationChange,
  onStreetsChange,
}) => {
  const [position, setPosition] = useState(center);
  const [streets, setStreets] = useState([]);
  const [removedStreets, setRemovedStreets] = useState([]);

  // Actualizar la posición cuando cambia el centro desde props
  useEffect(() => {
    setPosition(center);
  }, [center]);

  // Ensure Leaflet is loaded correctly
  useEffect(() => {
    // Force a re-render to make sure the map is displayed correctly
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Obtener calles cuando cambia la ubicación o el radio
  useEffect(() => {
    if (!position) return;

    const getStreets = async () => {
      try {
        const streetNames = await fetchStreetsInRadius(
          position.lat,
          position.lng,
          radius
        );
        setStreets(streetNames);

        // Emitir evento con las calles actualizadas
        if (onStreetsChange) {
          onStreetsChange(streetNames, removedStreets);
        }
      } catch (error) {
        console.error("Error fetching streets:", error);
      }
    };

    getStreets();
  }, [position, radius, onStreetsChange, removedStreets]);
  return (
    <div
      style={{ height }}
      className="rounded-lg overflow-hidden border border-gray-300"
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        easeLinearity={0.35}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController position={position} />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationChange={onLocationChange}
        />

        <Circle
          center={[position.lat, position.lng]}
          radius={radius * 1000}
          pathOptions={{
            color: "#FFA500",
            fillColor: "#FFA500",
            fillOpacity: 0.2,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default SimpleLeafletMap;
