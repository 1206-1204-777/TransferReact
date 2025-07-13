import { AlertCircle, CheckCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import { Message } from '../../types';

interface MessageDisplayProps {
  message: Message;
  onClear: () => void;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, onClear }) => {
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(onClear, 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text, onClear]);

  if (!message.text) return null;

  return (
    <div className={`mb-4 p-4 rounded-2xl border ${
      message.type === 'success' 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-center space-x-2">
        {message.type === 'success' ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
        <span>{message.text}</span>
      </div>
    </div>
  );
};