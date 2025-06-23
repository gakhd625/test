
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePins } from '@/hooks/usePins';
import Header from '@/components/Header';
import MapView from '@/components/MapView';
import AddPinModal from '@/components/AddPinModal';
import PinGalleryModal from '@/components/PinGalleryModal';
import TimelineView from '@/components/TimelineView';
import TokenInput from '@/components/TokenInput';
import AuthModal from '@/components/AuthModal';
import { TravelPin } from '@/types';
import { MapPin, Calendar } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { pins, loading: pinsLoading, addPin } = usePins();
  const [currentView, setCurrentView] = useState<'map' | 'timeline'>('map');
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // Add pin modal state
  const [addPinModalOpen, setAddPinModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Gallery modal state
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<TravelPin | null>(null);

  // Handle map click to add new pin
  const handleMapClick = (lat: number, lng: number) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedLocation({ lat, lng });
    setAddPinModalOpen(true);
  };

  // Handle pin click to view gallery
  const handlePinClick = (pin: TravelPin) => {
    setSelectedPin(pin);
    setGalleryModalOpen(true);
  };

  // Handle saving new pin
  const handleSavePin = async (pinData: {
    title: string;
    description: string;
    visitDate: Date;
    photos: File[];
  }) => {
    if (!selectedLocation) return;
    
    await addPin(selectedLocation.lat, selectedLocation.lng, pinData);
    setAddPinModalOpen(false);
    setSelectedLocation(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!mapboxToken) {
    return <TokenInput onTokenSubmit={setMapboxToken} />;
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Travel Memories</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Document your adventures with photos and memories. Drop pins on places you've visited and create a beautiful timeline of your travels.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Start Your Journey
            </button>
          </div>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="h-[calc(100vh-73px)]">
        {currentView === 'map' ? (
          <MapView
            pins={pins}
            onMapClick={handleMapClick}
            onPinClick={handlePinClick}
            mapboxToken={mapboxToken}
          />
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto">
              <TimelineView pins={pins} onPinClick={handlePinClick} />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddPinModal
        isOpen={addPinModalOpen}
        onClose={() => {
          setAddPinModalOpen(false);
          setSelectedLocation(null);
        }}
        onSave={handleSavePin}
        lat={selectedLocation?.lat || 0}
        lng={selectedLocation?.lng || 0}
      />
      
      <PinGalleryModal
        isOpen={galleryModalOpen}
        onClose={() => {
          setGalleryModalOpen(false);
          setSelectedPin(null);
        }}
        pin={selectedPin}
      />
    </div>
  );
};

export default Index;
