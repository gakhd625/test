
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TravelPin } from '@/types';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface PinGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pin: TravelPin | null;
}

const PinGalleryModal = ({ isOpen, onClose, pin }: PinGalleryModalProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!pin) return null;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % pin.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + pin.photos.length) % pin.photos.length);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {pin.title}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(pin.visitDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</span>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {pin.photos.length > 0 ? (
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={pin.photos[currentPhotoIndex].url}
                  alt={`${pin.title} - Photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {pin.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                    {currentPhotoIndex + 1} / {pin.photos.length}
                  </div>
                </>
              )}
              
              {pin.photos[currentPhotoIndex].caption && (
                <p className="mt-2 text-sm text-gray-600 italic">
                  {pin.photos[currentPhotoIndex].caption}
                </p>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No photos for this location</p>
            </div>
          )}
          
          {pin.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{pin.description}</p>
            </div>
          )}
          
          {pin.photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {pin.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                    index === currentPhotoIndex ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinGalleryModal;
