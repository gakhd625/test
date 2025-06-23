
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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
      const q = query(
        collection(db, 'pins'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedPins: TravelPin[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedPins.push({
          id: doc.id,
          ...data,
          visitDate: data.visitDate.toDate(),
          createdAt: data.createdAt.toDate(),
        } as TravelPin);
      });
      
      setPins(fetchedPins);
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
        const storageRef = ref(storage, `photos/${user.uid}/${photoId}`);
        
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        uploadedPhotos.push({
          id: photoId,
          url: downloadURL,
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
