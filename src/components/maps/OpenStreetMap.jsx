import React from "react";
import MapBox from "./MapBox";

const OpenStreetMap = ({
  onLocationSelect,
  onRadiusChange,
  onNeighborhoodsChange,
  radius = 5,
}) => {
  return (
    <MapBox
      initialCenter={{ lng: 36.2765, lat: 33.5138 }} // دمشق، سوريا
      initialZoom={13}
      onLocationSelect={onLocationSelect}
      onRadiusChange={onRadiusChange}
      onNeighborhoodsChange={onNeighborhoodsChange}
      radius={radius}
      height="400px"
      showRadius={true}
    />
  );
};

export default OpenStreetMap;
