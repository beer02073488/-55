
import React, { useMemo } from 'react';
import type { Building, Room } from '../types';
import { RoomStatus } from '../types';
import { BuildingIcon } from './icons/BuildingIcon';
import { PlusIcon } from './icons/PlusIcon';
import { Trash2Icon } from './icons/Trash2Icon';
import { LayersIcon } from './icons/LayersIcon';

interface SidebarProps {
  buildings: Building[];
  rooms: Room[];
  selectedBuildingId: string | 'all';
  onSelectBuilding: (id: string | 'all') => void;
  onAddBuilding: () => void;
  onDeleteBuilding: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ buildings, rooms, selectedBuildingId, onSelectBuilding, onAddBuilding, onDeleteBuilding }) => {
  const buildingStats = useMemo(() => {
    const stats = new Map<string, { total: number; completed: number }>();
    rooms.forEach(room => {
      const current = stats.get(room.buildingId) || { total: 0, completed: 0 };
      current.total++;
      if (room.status === RoomStatus.Completed) {
        current.completed++;
      }
      stats.set(room.buildingId, current);
    });
    return stats;
  }, [rooms]);

  return (
    <aside className="w-72 bg-white flex flex-col p-4 border-r border-slate-200">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <BuildingIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800">Project Management</h1>
          <p className="text-xs text-slate-500">The Urban Tier Installation</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar -mr-2 pr-2">
        <h2 className="text-sm font-semibold text-slate-500 px-3 pt-4 pb-2 uppercase tracking-wider">โครงการ</h2>
        
        <NavItem
          label="ภาพรวมทั้งหมด"
          count={rooms.length}
          isActive={selectedBuildingId === 'all'}
          onClick={() => onSelectBuilding('all')}
          icon={<LayersIcon className="w-5 h-5" />}
        />

        {buildings.map(building => {
          const stats = buildingStats.get(building.id) || { total: 0, completed: 0 };
          const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
          return (
            <div key={building.id} className="group relative">
                <ProgressNavItem
                    buildingName={building.name}
                    completed={stats.completed}
                    total={stats.total}
                    progress={progress}
                    isActive={selectedBuildingId === building.id}
                    onClick={() => onSelectBuilding(building.id)}
                />
                <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteBuilding(building.id); }}
                    className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 rounded-md text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all"
                    aria-label={`Delete building ${building.name}`}
                >
                    <Trash2Icon className="w-4 h-4" />
                </button>
            </div>
          );
        })}
      </nav>

      <div className="mt-4">
        <button
          onClick={onAddBuilding}
          className="w-full flex items-center justify-center gap-2 text-blue-600 font-medium py-3 px-4 rounded-xl border-2 border-dashed border-blue-200 hover:bg-blue-50 bg-white transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>เพิ่มโครงการใหม่</span>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ label, count, isActive, onClick, icon }) => (
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center justify-between p-3 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>
      {count}
    </span>
  </a>
);

interface ProgressNavItemProps {
    buildingName: string;
    completed: number;
    total: number;
    progress: number;
    isActive: boolean;
    onClick: () => void;
}

const ProgressNavItem: React.FC<ProgressNavItemProps> = ({ buildingName, completed, total, progress, isActive, onClick }) => (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className={`block w-full text-left p-3 rounded-lg transition ${isActive ? 'bg-blue-50' : 'hover:bg-slate-100'}`}>
        <div className="flex justify-between items-center mb-1.5">
            <span className={`font-semibold text-sm ${isActive ? 'text-blue-800' : 'text-slate-700'}`}>
                โครงการ {buildingName}
            </span>
            <span className={`text-xs font-mono ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                {completed}/{total}
            </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
    </a>
);


export default Sidebar;
