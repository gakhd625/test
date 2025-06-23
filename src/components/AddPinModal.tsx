
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, X } from 'lucide-react';
import { TravelPhoto } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AddPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pinData: {
    title: string;
    description: string;
    visitDate: Date;
    photos: File[];
  }) => Promise<void>;
  lat: number;
  lng: number;
}

const AddPinModal = ({ isOpen, onClose, onSave, lat, lng }: AddPinModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    onDrop: (acceptedFiles) => {
      setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Error", description: "Please enter a title", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        visitDate: new Date(visitDate),
        photos: selectedFiles
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setVisitDate(new Date().toISOString().split('T')[0]);
      setSelectedFiles([]);
      onClose();
      
      toast({ title: "Success!", description: "Your travel memory has been saved!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save pin", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Add Travel Memory
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Place Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Eiffel Tower, Beach Paradise..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visitDate">Visit Date</Label>
            <Input
              id="visitDate"
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your memories from this place..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Photos</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-orange-400'
              }`}
            >
              <input {...getInputProps()} />
              <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              {isDragActive ? (
                <p className="text-orange-600">Drop the photos here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-1">Drag & drop photos here</p>
                  <p className="text-sm text-gray-400">or click to select files</p>
                </div>
              )}
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Memory'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPinModal;
