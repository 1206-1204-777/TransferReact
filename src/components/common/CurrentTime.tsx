import React from 'react';
import { useCurrentTime } from '../../hooks/useCurrentTime';

export const CurrentTime: React.FC = () => {
  const currentTime = useCurrentTime();
  
  return (
    <div className="text-center mb-6">
      <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
        {currentTime.toLocaleTimeString('ja-JP')}
      </div>
      <div className="text-lg text-gray-600">
        {currentTime.toLocaleDateString('ja-JP', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          weekday: 'long' 
        })}
      </div>
    </div>
  );
};