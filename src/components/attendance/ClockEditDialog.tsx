import React, { useEffect, useState } from 'react';
import { CustomModal } from '../common/CustomModal';

interface ClockEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (time: string) => Promise<void>;
  currentTime: string;
}

export const ClockEditDialog: React.FC<ClockEditDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentTime 
}) => {
  const [editTime, setEditTime] = useState(currentTime);

  useEffect(() => {
    if (isOpen) {
      setEditTime(currentTime);
    }
  }, [isOpen, currentTime]);

  const handleSave = async () => {
    await onSave(editTime);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="打刻時刻の修正"
      onConfirm={handleSave}
      confirmText="保存"
      cancelText="キャンセル"
    >
      <div className="mb-6">
        <label htmlFor="edit-time" className="block text-sm font-medium text-gray-700 mb-2">
          修正時刻
        </label>
        <input
          id="edit-time"
          type="time"
          value={editTime}
          onChange={(e) => setEditTime(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
        />
      </div>
    </CustomModal>
  );
};