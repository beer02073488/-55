
import React, { useState, useMemo, useCallback } from 'react';
import { useMockData } from './hooks/useMockData';
import type { Room, Building } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoomGrid from './components/RoomGrid';
import AddBuildingModal from './components/AddBuildingModal';
import AddRoomModal from './components/AddRoomModal';
import RoomDetailModal from './components/RoomDetailModal';
import { BuildingIcon } from './components/icons/BuildingIcon';

const App: React.FC = () => {
  const { 
    data, 
    loading, 
    addBuilding, 
    addRoom, 
    updateRoom, 
    deleteBuilding 
  } = useMockData();
  
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | 'all'>('all');
  const [isAddBuildingModalOpen, setAddBuildingModalOpen] = useState(false);
  const [isAddRoomModalOpen, setAddRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleSelectBuilding = useCallback((id: string | 'all') => {
    setSelectedBuildingId(id);
  }, []);

  const handleAddRoom = useCallback((floor: number, roomNo: string) => {
    if (typeof selectedBuildingId === 'string' && selectedBuildingId !== 'all') {
      addRoom(selectedBuildingId, floor, roomNo);
    }
  }, [addRoom, selectedBuildingId]);

  const handleUpdateRoom = useCallback((updatedRoom: Room) => {
    updateRoom(updatedRoom);
  }, [updateRoom]);

  const handleDeleteBuilding = useCallback((buildingId: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบโครงการนี้และห้องทั้งหมดที่อยู่ภายใน?`)) {
      deleteBuilding(buildingId);
      setSelectedBuildingId('all');
    }
  }, [deleteBuilding]);

  const displayedRooms = useMemo(() => {
    if (selectedBuildingId === 'all') return data.rooms;
    return data.rooms.filter(room => room.buildingId === selectedBuildingId);
  }, [data.rooms, selectedBuildingId]);
  
  const selectedBuildingName = useMemo(() => {
    if (selectedBuildingId === 'all') return 'ภาพรวมโครงการ';
    const building = data.buildings.find(b => b.id === selectedBuildingId);
    return building ? `โครงการ ${building.name}` : '';
  }, [data.buildings, selectedBuildingId]);

  if (loading && data.buildings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">กำลังโหลดข้อมูลโครงการ...</p>
        </div>
      </div>
    );
  }

  if (data.buildings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md mx-auto">
          <div className="bg-blue-100 p-5 rounded-full inline-block mb-6">
            <BuildingIcon className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">ยินดีต้อนรับ</h2>
          <p className="text-slate-500 mb-8">เริ่มจัดการโครงการของคุณโดยการเพิ่มโครงการแรก</p>
          <button 
            onClick={() => setAddBuildingModalOpen(true)}
            className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg transition-all transform hover:scale-105"
          >
            สร้างโครงการแรก
          </button>
        </div>
        <AddBuildingModal
          isOpen={isAddBuildingModalOpen}
          onClose={() => setAddBuildingModalOpen(false)}
          onAdd={addBuilding}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        buildings={data.buildings}
        rooms={data.rooms}
        selectedBuildingId={selectedBuildingId}
        onSelectBuilding={handleSelectBuilding}
        onAddBuilding={() => setAddBuildingModalOpen(true)}
        onDeleteBuilding={handleDeleteBuilding}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
        <Dashboard buildings={data.buildings} rooms={data.rooms} />
        <RoomGrid
          rooms={displayedRooms}
          title={selectedBuildingName}
          isAllView={selectedBuildingId === 'all'}
          onAddRoom={() => setAddRoomModalOpen(true)}
          onSelectRoom={setSelectedRoom}
        />
      </main>
      
      <AddBuildingModal
        isOpen={isAddBuildingModalOpen}
        onClose={() => setAddBuildingModalOpen(false)}
        onAdd={addBuilding}
      />
      
      {selectedBuildingId !== 'all' && (
        <AddRoomModal
          isOpen={isAddRoomModalOpen}
          onClose={() => setAddRoomModalOpen(false)}
          onAdd={handleAddRoom}
        />
      )}

      {selectedRoom && (
        <RoomDetailModal
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          room={selectedRoom}
          onSave={handleUpdateRoom}
          buildingName={data.buildings.find(b => b.id === selectedRoom.buildingId)?.name || ''}
        />
      )}
    </div>
  );
};

export default App;
