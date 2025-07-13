import React from 'react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  showConfirmButton?: boolean;
}

export const CustomModal: React.FC<CustomModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  confirmText = 'はい', 
  cancelText = 'キャンセル',
  showConfirmButton = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-auto shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">{title}</h3>
        <div className="text-gray-700 mb-8">
          {children}
        </div>
        <div className="flex space-x-4">
          {showConfirmButton && (
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300 ${!showConfirmButton ? 'w-full' : ''}`}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};