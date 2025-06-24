// filepath: c:\g\photo-travel-log\src\components\MapSearch.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface GeocodingResult {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
}

interface MapSearchProps {
  mapboxToken: string;
  onResultSelect: (coords: { lng: number; lat: number }) => void;
}

const MapSearch = ({ mapboxToken, onResultSelect }: MapSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${mapboxToken}&autocomplete=true&limit=5`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setResults(data.features || []);
      } catch (error) {
        console.error('Error fetching geocoding data:', error);
        setResults([]);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, mapboxToken]);

  const handleSelectResult = (result: GeocodingResult) => {
    const [lng, lat] = result.center;
    onResultSelect({ lng, lat });
    setQuery(result.place_name);
    setResults([]);
    setIsFocused(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search for a place..."
          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        {query && (
          <button 
            onClick={clearSearch} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isFocused && results.length > 0 && (
          <ul className="absolute w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-20 max-h-60 overflow-y-auto">
            {results.map((result) => (
              <li
                key={result.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectResult(result);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
              >
                {result.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MapSearch;
