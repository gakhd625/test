import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { supabase } from '../lib/supabase';
import { TravelPin, TravelPhoto } from '@/types';
import { useAuth } from './useAuth';

export const usePins = () => {
  const [pins, setPins] = useState<TravelPin[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPins = async () => {
    if (!user) {
      setPins([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pins')
        .select('*')
        .eq('userId', user.uid)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      setPins(data || []);
    } catch (error) {
      console.error('Error fetching pins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, [user]);

  const addPin = async (
    lat: number,
    lng: number,
    pinData: {
      title: string;
      description: string;
      visitDate: Date;
      photos: File[];
    }
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Upload photos first
      const uploadedPhotos: TravelPhoto[] = [];
      
      for (const file of pinData.photos) {
        const photoId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const url = await uploadPhoto(user.uid, file);
        
        uploadedPhotos.push({
          id: photoId,
          url: url,
          uploadDate: new Date(),
          metadata: {
            size: file.size,
            type: file.type,
            name: file.name,
          },
        });
      }

      // Create pin document
      const pinDoc = {
        lat,
        lng,
        title: pinData.title,
        description: pinData.description,
        visitDate: Timestamp.fromDate(pinData.visitDate),
        photos: uploadedPhotos,
        userId: user.uid,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'pins'), pinDoc);
      
      // Add to local state
      const newPin: TravelPin = {
        id: docRef.id,
        lat,
        lng,
        title: pinData.title,
        description: pinData.description,
        visitDate: pinData.visitDate,
        photos: uploadedPhotos,
        userId: user.uid,
        createdAt: new Date(),
      };
      
      setPins(prev => [newPin, ...prev]);
      
      return newPin;
    } catch (error) {
      console.error('Error adding pin:', error);
      throw error;
    }
  };

  return {
    pins,
    loading,
    addPin,
    refetch: fetchPins,
  };
};

export async function uploadPhoto(userId: string, file: File) {
  const filePath = `${userId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('photos') // your bucket name
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('photos')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
