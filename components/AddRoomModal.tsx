
import React, { useState } from 'react';
import Modal from './Modal';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (floor: number, roomNo: string) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [floor, setFloor] = useState<string>('');
  const [roomNo, setRoomNo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const floorNum = parseInt(floor, 10);
    if (roomNo.trim() && !isNaN(floorNum)) {
      onAdd(floorNum, roomNo.trim());
      setFloor('');
      setRoomNo('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มห้องใหม่">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="floor" className="block text-sm font-bold text-slate-700 mb-1">
              ชั้น (Floor)
            </label>
            <input
              type="number"
              id="floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="roomNo" className="block text-sm font-bold text-slate-700 mb-1">
              เลขห้อง (Room No.)
            </label>
            <input
              type="text"
              id="roomNo"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow font-medium transition-colors"
          >
            เพิ่มห้อง
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRoomModal;
