import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import WorkerLocationMap from "./WorkerLocationMap";

const MapBox = forwardRef(
  (
    {
      initialCenter = { lng: 36.2765, lat: 33.5138 }, // Damascus, Syria
      markers = [],
      onLocationSelect,
      onRadiusChange,
      onNeighborhoodsChange, // إضافة دالة لتحديث الأحياء
      onStreetsChange, // إضافة دالة لتحديث الشوارع
      radius = 5, // in km
      height = "400px",
      interactive = true,
    },
    ref
  ) => {
    // Convert initialCenter format if needed (lng/lat to lat/lng)
    const formattedLocation = {
      lat: initialCenter.lat,
      lng: initialCenter.lng,
    };

    const [selectedLocation, setSelectedLocation] = useState(formattedLocation);
    const [currentRadius, setCurrentRadius] = useState(radius);
    const [areas, setAreas] = useState([]);

    // Exponer métodos al componente padre
    useImperativeHandle(ref, () => ({
      updateLocation: (newLocation) => {
        console.log("Updating map location to:", newLocation);
        // Actualizar la ubicación seleccionada para que el mapa se centre en ella
        setSelectedLocation({
          lat: newLocation.lat,
          lng: newLocation.lng,
        });
      },
      // إضافة دالة لتحديث نطاق العمل
      updateRadius: (newRadius) => {
        console.log("Updating map radius to:", newRadius);
        // تحديث نطاق العمل في الخريطة
        setCurrentRadius(newRadius);
      },
    }));

    // Handle location selection
    const handleLocationSelect = (newLocation) => {
      console.log("Location selected:", newLocation);
      setSelectedLocation(newLocation);
      if (onLocationSelect) {
        onLocationSelect(newLocation);
      }
    };

    // Handle radius change
    const handleRadiusChange = (newRadius) => {
      setCurrentRadius(newRadius);
      if (onRadiusChange) {
        onRadiusChange(newRadius);
      }
    };

    // Handle areas change
    const handleAreasChange = (newAreas) => {
      setAreas(newAreas);
      if (onNeighborhoodsChange) {
        onNeighborhoodsChange(newAreas);
      }
    };

    // تحديث البيانات عند تغيير الموقع أو نطاق العمل
    useEffect(() => {
      // لا نقوم بأي شيء هنا، سنعتمد على تحديث البيانات من خلال دالة onStreetsChange في WorkerLocationMap
    }, [selectedLocation, currentRadius]);

    return (
      <WorkerLocationMap
        location={selectedLocation}
        setLocation={handleLocationSelect}
        radius={currentRadius}
        setRadius={handleRadiusChange}
        areas={areas}
        setAreas={handleAreasChange}
        height={height}
        interactive={interactive}
        showRadius={true}
        markers={markers}
        onStreetsChange={onStreetsChange}
      />
    );
  }
);

export default MapBox;
