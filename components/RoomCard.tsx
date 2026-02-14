
import React from 'react';
import type { Room } from '../types';
import { RoomStatus } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { RocketIcon } from './icons/RocketIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ImageIcon } from './icons/ImageIcon';
import { WrenchIcon } from './icons/WrenchIcon';

interface RoomCardProps {
  room: Room;
  onClick: () => void;
}

const statusConfig = {
  [RoomStatus.Completed]: {
    bg: 'bg-green-50 border-green-200 text-green-800',
    text: 'ติดตั้งเสร็จ',
    icon: <CheckIcon className="w-3.5 h-3.5" />,
    textColor: 'text-green-700'
  },
  [RoomStatus.Issue]: {
    bg: 'bg-red-50 border-red-200 text-red-800',
    text: 'แจ้งซ่อม',
    icon: <AlertTriangleIcon className="w-3.5 h-3.5" />,
    textColor: 'text-red-700'
  },
  [RoomStatus.Ready]: {
    bg: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    text: 'พร้อมติดตั้ง',
    icon: <RocketIcon className="w-3.5 h-3.5" />,
    textColor: 'text-yellow-700'
  },
  [RoomStatus.Pending]: {
    bg: 'bg-slate-100 border-slate-200 text-slate-800',
    text: 'รอดำเนินการ',
    icon: <ClockIcon className="w-3.5 h-3.5" />,
    textColor: 'text-slate-500'
  },
};

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  const config = statusConfig[room.status];

  return (
    <button
      onClick={onClick}
      className={`room-card bg-white rounded-xl shadow-sm p-4 group relative flex flex-col justify-between h-36 border text-left transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-1 ${config.bg}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold uppercase opacity-60">Room</span>
        <div className="flex gap-1.5">
          {room.images.length > 0 && (
            <div className="flex items-center gap-1 bg-white/70 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-blue-100">
              <ImageIcon className="w-3 h-3" /> {room.images.length}
            </div>
          )}
          {room.issueCount > 0 && (
            <div className="flex items-center gap-1 bg-white/70 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-red-100">
              <WrenchIcon className="w-3 h-3" /> {room.issueCount}
            </div>
          )}
        </div>
      </div>
      <div className="text-center my-1">
        <div className="font-bold text-4xl tracking-tight">{room.roomNo}</div>
        <div className="text-xs text-slate-500 mt-1">
          ชั้น <span className="font-semibold">{room.floor}</span>
        </div>
      </div>
      <div className={`flex items-center justify-center gap-1.5 text-xs font-bold ${config.textColor}`}>
        {config.icon}
        <span>{config.text}</span>
      </div>
    </button>
  );
};

export default RoomCard;
