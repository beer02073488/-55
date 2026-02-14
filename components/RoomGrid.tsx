
import React, { useState, useMemo } from 'react';
import type { Room } from '../types';
import RoomCard from './RoomCard';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface RoomGridProps {
  rooms: Room[];
  title: string;
  isAllView: boolean;
  onAddRoom: () => void;
  onSelectRoom: (room: Room) => void;
}

const RoomGrid: React.FC<RoomGridProps> = ({ rooms, title, isAllView, onAddRoom, onSelectRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room => room.roomNo.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.roomNo.localeCompare(b.roomNo, undefined, { numeric: true }));
  }, [rooms, searchTerm]);
  
  const roomsByFloor = useMemo(() => {
    const grouped: { [key: number]: Room[] } = {};
    filteredRooms.forEach(room => {
      const floor = room.floor;
      if (!grouped[floor]) {
        grouped[floor] = [];
      }
      grouped[floor].push(room);
    });
    return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));
  }, [filteredRooms]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 min-h-[500px]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-2xl text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{rooms.length} ห้อง</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                <input
                    type="text"
                    placeholder="ค้นหาเลขห้อง..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {!isAllView && (
              <button
                onClick={onAddRoom}
                className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 shadow flex items-center gap-2 transition-colors flex-shrink-0"
              >
                <PlusIcon className="w-5 h-5" />
                <span>เพิ่มห้อง</span>
              </button>
            )}
        </div>
      </div>
      
      {rooms.length === 0 && !isAllView ? (
        <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-lg font-medium">ยังไม่มีห้องในโครงการนี้</p>
          <p>คลิก 'เพิ่มห้อง' เพื่อเริ่มต้น</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="col-span-full py-20 text-center text-slate-400">
          <p className="text-lg font-medium">ไม่พบห้องที่ตรงกับการค้นหา</p>
        </div>
      ) : (
        <div className="space-y-8">
            {roomsByFloor.map(([floor, floorRooms]) => (
                <div key={floor}>
                    <h4 className="font-bold text-xl text-slate-700 mb-4 pb-2 border-b-2 border-slate-200">ชั้น {floor}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                        {floorRooms.map(room => (
                            <RoomCard key={room.id} room={room} onClick={() => onSelectRoom(room)} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RoomGrid;
