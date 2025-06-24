import { useRef } from 'react';
import Map, { Marker, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TravelPin } from '@/types';
import MapSearch from './MapSearch';

interface MapViewProps {
  pins: TravelPin[];
  onMapClick: (lat: number, lng: number) => void;
  onPinClick: (pin: TravelPin) => void;
  mapboxToken: string;
}

const MapView = ({ pins, onMapClick, onPinClick, mapboxToken }: MapViewProps) => {
  const mapRef = useRef<MapRef>(null);

  const handleMapClick = (e: mapboxgl.MapLayerMouseEvent) => {
    const { lng, lat } = e.lngLat;
    onMapClick(lat, lng);
  };

  const handleSearchResult = (coords: { lng: number; lat: number }) => {
    mapRef.current?.flyTo({ center: [coords.lng, coords.lat], zoom: 14 });
  };

  return (
    <div className="relative h-full w-full">
      <MapSearch mapboxToken={mapboxToken} onResultSelect={handleSearchResult} />
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: 0,
          latitude: 20,
          zoom: 2
        }}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        style={{ width: '100%', height: '100%' }}
      >
        {pins.map((pin, index) => (
          <Marker
            key={index}
            longitude={pin.lng}
            latitude={pin.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onPinClick(pin);
            }}
          >
            <div className="w-6 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapView;
