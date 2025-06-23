
export interface TravelPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  visitDate: Date;
  photos: TravelPhoto[];
  userId: string;
  createdAt: Date;
}

export interface TravelPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadDate: Date;
  metadata?: {
    size: number;
    type: string;
    name: string;
  };
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
