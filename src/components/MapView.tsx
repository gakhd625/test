
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TravelPin } from '@/types';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  pins: TravelPin[];
  onMapClick: (lat: number, lng: number) => void;
  onPinClick: (pin: TravelPin) => void;
  mapboxToken: string;
}

const MapView = ({ pins, onMapClick, onPinClick, mapboxToken }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [0, 20],
      zoom: 2
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add click handler for adding new pins
    map.current.on('click', (e) => {
      onMapClick(e.lngLat.lat, e.lngLat.lng);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when pins change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    pins.forEach(pin => {
      const markerElement = document.createElement('div');
      markerElement.className = 'w-8 h-8 bg-gradient-to-b from-orange-400 to-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200 flex items-center justify-center';
      markerElement.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([pin.lng, pin.lat])
        .addTo(map.current!);

      markerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        onPinClick(pin);
      });

      markers.current.push(marker);
    });
  }, [pins, onPinClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-700">Click anywhere to add a pin!</p>
      </div>
    </div>
  );
};

export default MapView;
