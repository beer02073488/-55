
export enum RoomStatus {
  Pending = 'pending',
  Ready = 'ready',
  Completed = 'completed',
  Issue = 'issue',
}

export enum ImageCategory {
  Ready = 'ready',
  Completed = 'completed',
  Issue = 'issue',
}

export interface AppImage {
  id: string;
  url: string;
  category: ImageCategory;
}

export interface Building {
  id: string;
  name: string;
  description: string;
}

export interface Room {
  id: string;
  buildingId: string;
  floor: number;
  roomNo: string;
  status: RoomStatus;
  installDate?: string;
  images: AppImage[];
  notes?: string;
  issueCount: number;
  installerName?: string;
}

export interface Issue {
  id: string;
  roomId: string;
  timestamp: string;
  description: string;
  reportedBy: string;
}

export interface AppData {
  buildings: Building[];
  rooms: Room[];
  issues: Issue[];
}
