
import React, { useState } from 'react';
import Modal from './Modal';

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, description: string) => void;
}

const AddBuildingModal: React.FC<AddBuildingModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), description.trim());
      setName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มโครงการใหม่">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="buildingName" className="block text-sm font-bold text-slate-700 mb-1">
              ชื่อโครงการ (Building Name)
            </label>
            <input
              type="text"
              id="buildingName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="buildingDescription" className="block text-sm font-bold text-slate-700 mb-1">
              คำอธิบาย (ไม่บังคับ)
            </label>
            <textarea
              id="buildingDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            สร้างโครงการ
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBuildingModal;
