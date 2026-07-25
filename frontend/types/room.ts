export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';

export interface RoomStudent {
  id: string;
  user: {
    fullName: string;
    email: string;
  };
}

export interface Room {
  id: string;
  roomNumber: string;
  block: string;
  floor: number;
  capacity: number;
  status: RoomStatus;
  amenities: string[];
  students: RoomStudent[];
  occupancy?: number;
  isFull?: boolean;
  createdAt: string;
  updatedAt: string;
}