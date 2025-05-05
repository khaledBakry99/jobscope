import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// استخدام مفتاح API مؤقت - في التطبيق الحقيقي يجب وضعه في ملف بيئة
mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZS1tYXBib3giLCJhIjoiY2xvMXJlcWJnMDFsNzJrcGR0YXRlcnM1aCJ9.qoQP6uY9N6m1qfm9TK7y9g';

const SimpleMap = ({ onLocationSelect, onRadiusChange, radius = 5 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const radiusCircle = useRef(null);
  
  const [location, setLocation] = useState({ lng: 36.2765, lat: 33.5138 }); // دمشق، سوريا
  
  // تهيئة الخريطة عند تحميل المكون
  useEffect(() => {
    // التأكد من وجود الحاوية
    if (!mapContainer.current) return;
    
    // إنشاء الخريطة
    const initializeMap = () => {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [location.lng, location.lat],
          zoom: 12,
        });
        
        // إضافة أدوات التحكم في الخريطة
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // إضافة علامة الموقع
        marker.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([location.lng, location.lat])
          .addTo(map.current);
        
        // تحديث الموقع عند سحب العلامة
        marker.current.on('dragend', () => {
          const lngLat = marker.current.getLngLat();
          setLocation({ lng: lngLat.lng, lat: lngLat.lat });
          if (onLocationSelect) {
            onLocationSelect({ lng: lngLat.lng, lat: lngLat.lat });
          }
          updateRadiusCircle();
        });
        
        // إضافة معالج النقر على الخريطة
        map.current.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          setLocation({ lng, lat });
          marker.current.setLngLat([lng, lat]);
          if (onLocationSelect) {
            onLocationSelect({ lng, lat });
          }
          updateRadiusCircle();
        });
        
        // إضافة دائرة نطاق العمل
        map.current.on('load', () => {
          updateRadiusCircle();
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    // محاولة تهيئة الخريطة
    initializeMap();
    
    // تنظيف عند إزالة المكون
    return () => {
      if (map.current) {
        try {
          map.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
      }
    };
  }, []);
  
  // تحديث دائرة نطاق العمل
  const updateRadiusCircle = () => {
    if (!map.current || !map.current.loaded()) return;
    
    try {
      // إزالة الدائرة السابقة إن وجدت
      if (map.current.getSource('radius-circle')) {
        map.current.removeLayer('radius-circle-fill');
        map.current.removeSource('radius-circle');
      }
      
      // إضافة دائرة جديدة
      map.current.addSource('radius-circle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat],
          },
          properties: {
            radius: radius,
          },
        },
      });
      
      map.current.addLayer({
        id: 'radius-circle-fill',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': radius * 1000, // تحويل إلى أمتار
          'circle-color': '#FFA500',
          'circle-opacity': 0.2,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFA500',
        },
      });
    } catch (error) {
      console.error('Error updating radius circle:', error);
    }
  };
  
  // تحديث دائرة نطاق العمل عند تغيير نصف القطر
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      updateRadiusCircle();
    }
  }, [radius]);
  
  // معالج تغيير نطاق العمل
  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value, 10);
    if (onRadiusChange) {
      onRadiusChange(newRadius);
    }
  };
  
  return (
    <div className="relative">
      <div ref={mapContainer} className="h-80 rounded-lg overflow-hidden mb-4" />
      
      <div className="bg-white p-3 rounded-md shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          نطاق العمل: {radius} كم
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={radius}
          onChange={handleRadiusChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SimpleMap;
