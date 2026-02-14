
import { useState, useEffect, useCallback } from 'react';
import type { AppData, Room, Building, Issue, AppImage } from '../types';
import { RoomStatus, ImageCategory } from '../types';

const initialData: AppData = {
  buildings: [
    { id: 'b1', name: 'A', description: 'Tower A' },
    { id: 'b2', name: 'B', description: 'Tower B' },
  ],
  rooms: [
    { id: 'r1', buildingId: 'b1', floor: 1, roomNo: '101', status: RoomStatus.Completed, installDate: '2023-10-15', images: [{id: 'img1', url: 'https://picsum.photos/seed/r1/400/300', category: ImageCategory.Completed}], issueCount: 0, installerName: 'ทีม Alpha' },
    { id: 'r2', buildingId: 'b1', floor: 1, roomNo: '102', status: RoomStatus.Pending, images: [], issueCount: 0 },
    { id: 'r3', buildingId: 'b1', floor: 1, roomNo: '103', status: RoomStatus.Issue, images: [{id: 'img2', url: 'https://picsum.photos/seed/r3/400/300', category: ImageCategory.Issue}], issueCount: 1, installerName: 'ทีม Bravo' },
    { id: 'r4', buildingId: 'b1', floor: 2, roomNo: '201', status: RoomStatus.Ready, images: [{id: 'img3', url: 'https://picsum.photos/seed/r4/400/300', category: ImageCategory.Ready}], issueCount: 0 },
    { id: 'r5', buildingId: 'b2', floor: 1, roomNo: '101', status: RoomStatus.Pending, images: [], issueCount: 0 },
    { id: 'r6', buildingId: 'b2', floor: 1, roomNo: '102', status: RoomStatus.Completed, installDate: '2023-11-01', images: [{id: 'img4', url: 'https://picsum.photos/seed/r6/400/300', category: ImageCategory.Completed}], issueCount: 0, installerName: 'ทีม Alpha' },
  ],
  issues: [
    { id: 'i1', roomId: 'r3', timestamp: new Date().toISOString(), description: 'กระจกเป็นรอย', reportedBy: 'สมชาย' }
  ],
};

export const useMockData = () => {
  const [data, setData] = useState<AppData>({ buildings: [], rooms: [], issues: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch
    setTimeout(() => {
      setData(initialData);
      setLoading(false);
    }, 1000);
  }, []);
  
  const fakeApiCall = <T,>(callback: () => T): Promise<T> => {
    return new Promise(resolve => {
      setLoading(true);
      setTimeout(() => {
        const result = callback();
        resolve(result);
        setLoading(false);
      }, 500);
    });
  };

  const addBuilding = useCallback((name: string, description: string) => {
    fakeApiCall(() => {
      const newBuilding: Building = {
        id: `b${Date.now()}`,
        name,
        description,
      };
      setData(prevData => ({
        ...prevData,
        buildings: [...prevData.buildings, newBuilding],
      }));
    });
  }, []);

  const addRoom = useCallback((buildingId: string, floor: number, roomNo: string) => {
    fakeApiCall(() => {
      const newRoom: Room = {
        id: `r${Date.now()}`,
        buildingId,
        floor,
        roomNo,
        status: RoomStatus.Pending,
        images: [],
        issueCount: 0,
      };
      setData(prevData => ({
        ...prevData,
        rooms: [...prevData.rooms, newRoom],
      }));
    });
  }, []);

  const updateRoom = useCallback((updatedRoom: Room) => {
    fakeApiCall(() => {
      setData(prevData => ({
        ...prevData,
        rooms: prevData.rooms.map(room =>
          room.id === updatedRoom.id ? updatedRoom : room
        ),
      }));
    });
  }, []);
  
  const addIssue = useCallback((roomId: string, description: string, reportedBy: string) => {
    return fakeApiCall(() => {
        const newIssue: Issue = {
            id: `i${Date.now()}`,
            roomId,
            description,
            reportedBy,
            timestamp: new Date().toISOString(),
        };
        setData(prevData => ({
            ...prevData,
            issues: [...prevData.issues, newIssue],
        }));
    });
  }, []);

  const deleteBuilding = useCallback((buildingId: string) => {
    fakeApiCall(() => {
      setData(prevData => {
        const roomsInBuilding = prevData.rooms.filter(r => r.buildingId === buildingId).map(r => r.id);
        return {
          buildings: prevData.buildings.filter(b => b.id !== buildingId),
          rooms: prevData.rooms.filter(r => r.buildingId !== buildingId),
          issues: prevData.issues.filter(i => !roomsInBuilding.includes(i.roomId))
        }
      });
    });
  }, []);

  return { data, loading, addBuilding, addRoom, updateRoom, deleteBuilding, addIssue };
};
