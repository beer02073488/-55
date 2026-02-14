
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Room, AppImage } from '../types';
import { RoomStatus, ImageCategory } from '../types';
import Modal from './Modal';
import { CameraIcon } from './icons/CameraIcon';
import { XIcon } from './icons/XIcon';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  onSave: (updatedRoom: Room) => void;
  buildingName: string;
}

const statusOptions = [
    { id: RoomStatus.Pending, label: 'รอดำเนินการ', color: 'slate' },
    { id: RoomStatus.Ready, label: 'พร้อมติดตั้ง', color: 'yellow' },
    { id: RoomStatus.Completed, label: 'ติดตั้งเสร็จ', color: 'green' },
    { id: RoomStatus.Issue, label: 'แจ้งซ่อม', color: 'red' },
];

const statusColorClasses = {
    slate: { bg: 'bg-slate-200 hover:bg-slate-300', text: 'text-slate-800', active: 'bg-slate-600 text-white' },
    yellow: { bg: 'bg-yellow-200 hover:bg-yellow-300', text: 'text-yellow-800', active: 'bg-yellow-500 text-white' },
    green: { bg: 'bg-green-200 hover:bg-green-300', text: 'text-green-800', active: 'bg-green-600 text-white' },
    red: { bg: 'bg-red-200 hover:bg-red-300', text: 'text-red-800', active: 'bg-red-600 text-white' },
};


const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ isOpen, onClose, room, onSave, buildingName }) => {
  const [currentStatus, setCurrentStatus] = useState<RoomStatus>(room.status);
  const [installDate, setInstallDate] = useState(room.installDate || '');
  const [installerName, setInstallerName] = useState(room.installerName || '');
  const [notes, setNotes] = useState(room.notes || '');
  const [images, setImages] = useState<AppImage[]>(room.images || []);

  const [issueDescription, setIssueDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentStatus(room.status);
      setInstallDate(room.installDate || new Date().toISOString().split('T')[0]);
      setInstallerName(room.installerName || '');
      setNotes(room.notes || '');
      setImages(room.images || []);
      setIssueDescription('');
      setReportedBy('');
    }
  }, [isOpen, room]);

  const handleSave = () => {
    let issueCount = room.issueCount;
    if (currentStatus === RoomStatus.Issue && issueDescription.trim() && reportedBy.trim()) {
      // In a real app, you would call an addIssue function here.
      // We simulate it by just increasing the count.
      issueCount++;
    }
    const updatedRoom: Room = {
      ...room,
      status: currentStatus,
      installDate: currentStatus === RoomStatus.Completed ? installDate : undefined,
      installerName: currentStatus === RoomStatus.Completed ? installerName : undefined,
      notes,
      images,
      issueCount,
    };
    onSave(updatedRoom);
    onClose();
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, category: ImageCategory) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        id: `img_${Date.now()}_${Math.random()}`,
        url: URL.createObjectURL(file), // In real app, upload and get URL
        category
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };
  
  const title = `ห้อง ${room.roomNo} (โครงการ ${buildingName} / ชั้น ${room.floor})`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar space-y-6">
            {/* Status Selector */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">สถานะ</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {statusOptions.map(option => {
                        const colors = statusColorClasses[option.color as keyof typeof statusColorClasses];
                        const isActive = currentStatus === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => setCurrentStatus(option.id)}
                                className={`px-4 py-2.5 rounded-lg font-semibold transition-colors ${isActive ? colors.active : `${colors.bg} ${colors.text}`}`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Conditional Panels */}
            {currentStatus === RoomStatus.Completed && (
                 <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-4 animate-fade-in">
                    <h4 className="font-bold text-green-800">ข้อมูลการติดตั้ง</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700">วันที่ติดตั้ง</label>
                            <input type="date" value={installDate} onChange={e => setInstallDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg bg-white border-slate-300"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">ช่างผู้ติดตั้ง</label>
                            <input type="text" value={installerName} onChange={e => setInstallerName(e.target.value)} placeholder="ชื่อทีม / ชื่อช่าง" className="w-full mt-1 p-2 border rounded-lg bg-white border-slate-300"/>
                        </div>
                    </div>
                </div>
            )}
             {currentStatus === RoomStatus.Issue && (
                 <div className="bg-red-50 p-4 rounded-lg border border-red-200 space-y-4 animate-fade-in">
                    <h4 className="font-bold text-red-800">รายละเอียดการแจ้งซ่อม (ครั้งใหม่)</h4>
                    <div>
                       <label className="block text-sm font-medium text-slate-700">ผู้แจ้ง</label>
                       <input type="text" value={reportedBy} onChange={e => setReportedBy(e.target.value)} placeholder="ชื่อผู้แจ้ง" className="w-full mt-1 p-2 border rounded-lg bg-white border-slate-300"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">รายละเอียดปัญหา</label>
                        <textarea value={issueDescription} onChange={e => setIssueDescription(e.target.value)} placeholder="ระบุรายละเอียดปัญหาที่พบ..." className="w-full mt-1 p-2 border rounded-lg bg-white border-slate-300" rows={3}></textarea>
                    </div>
                </div>
            )}
            
            {/* Image Management */}
            <div className="pt-4 border-t border-slate-200">
                <h4 className="text-md font-bold text-slate-800 mb-3">รูปภาพประกอบ</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ImageSection title="พร้อมติดตั้ง" category={ImageCategory.Ready} images={images} onUpload={handleImageUpload} onRemove={removeImage} />
                    <ImageSection title="ติดตั้งเสร็จ" category={ImageCategory.Completed} images={images} onUpload={handleImageUpload} onRemove={removeImage} />
                    <ImageSection title="แจ้งซ่อม" category={ImageCategory.Issue} images={images} onUpload={handleImageUpload} onRemove={removeImage} />
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">หมายเหตุทั่วไป</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors">ยกเลิก</button>
          <button type="button" onClick={handleSave} className="px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow font-medium transition-colors">บันทึกข้อมูล</button>
        </div>
    </Modal>
  );
};

interface ImageSectionProps {
    title: string;
    category: ImageCategory;
    images: AppImage[];
    onUpload: (e: React.ChangeEvent<HTMLInputElement>, category: ImageCategory) => void;
    onRemove: (id: string) => void;
}

const ImageSection: React.FC<ImageSectionProps> = ({ title, category, images, onUpload, onRemove }) => {
    const categoryImages = images.filter(img => img.category === category);

    return (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-600 text-sm mb-2">{title} ({categoryImages.length})</h5>
            <div className="grid grid-cols-3 gap-2 mb-2">
                {categoryImages.map(img => (
                    <div key={img.id} className="relative group aspect-square">
                        <img src={img.url} alt="Room image" className="w-full h-full object-cover rounded-md" />
                        <button onClick={() => onRemove(img.id)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <XIcon className="w-3 h-3"/>
                        </button>
                    </div>
                ))}
            </div>
            <label className="w-full text-center block p-3 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 cursor-pointer hover:bg-slate-100 hover:border-blue-400 hover:text-blue-600 transition-colors">
                <CameraIcon className="w-5 h-5 mx-auto mb-1" />
                เพิ่มรูป
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onUpload(e, category)} />
            </label>
        </div>
    );
}

export default RoomDetailModal;
