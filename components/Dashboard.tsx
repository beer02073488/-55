
import React, { useMemo } from 'react';
import type { Building, Room } from '../types';
import { RoomStatus } from '../types';
import { BuildingIcon } from './icons/BuildingIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ClockIcon } from './icons/ClockIcon';
import { BoxIcon } from './icons/BoxIcon';
import { RocketIcon } from './icons/RocketIcon';

interface DashboardProps {
  buildings: Building[];
  rooms: Room[];
}

const Dashboard: React.FC<DashboardProps> = ({ buildings, rooms }) => {
  const stats = useMemo(() => {
    const counts = {
      [RoomStatus.Completed]: 0,
      [RoomStatus.Issue]: 0,
      [RoomStatus.Ready]: 0,
      [RoomStatus.Pending]: 0,
    };
    rooms.forEach(room => {
      if (counts.hasOwnProperty(room.status)) {
        counts[room.status]++;
      }
    });
    return counts;
  }, [rooms]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-5">ภาพรวมสถานะโครงการ</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<BuildingIcon className="w-6 h-6 text-blue-500"/>} label="โครงการ" value={buildings.length} />
        <StatCard icon={<BoxIcon className="w-6 h-6 text-slate-500"/>} label="ห้องทั้งหมด" value={rooms.length} />
        <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-green-500"/>} label="ติดตั้งเสร็จ" value={stats[RoomStatus.Completed]} />
        <StatCard icon={<AlertTriangleIcon className="w-6 h-6 text-red-500"/>} label="แจ้งซ่อม" value={stats[RoomStatus.Issue]} />
        <StatCard icon={<RocketIcon className="w-6 h-6 text-yellow-500"/>} label="พร้อมติดตั้ง" value={stats[RoomStatus.Ready]} />
        <StatCard icon={<ClockIcon className="w-6 h-6 text-gray-500"/>} label="รอดำเนินการ" value={stats[RoomStatus.Pending]} />
      </div>
    </div>
  );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value}) => (
    <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4">
        <div className="bg-white p-3 rounded-full border border-slate-200">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    </div>
);

export default Dashboard;
