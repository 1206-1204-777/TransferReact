import { Building, Edit3, Monitor, Timer } from 'lucide-react';
import React from 'react';

interface ClockButtonsProps {
  status: 'complete' | 'working' | 'breaking';
  loading: boolean;
  onClockIn: () => void;
  onClockInRemote: () => void;
  onClockOut: () => void;
  isWithin30Minutes: boolean;
  onEditClock: () => void;
}

export const ClockButtons: React.FC<ClockButtonsProps> = ({ 
  status, 
  loading, 
  onClockIn, 
  onClockInRemote, 
  onClockOut, 
  isWithin30Minutes, 
  onEditClock 
}) => (
  <div className="space-y-4 mb-6">
    <div className="flex space-x-4 justify-center flex-wrap gap-4">
      <button
        onClick={onClockIn}
        disabled={loading || status === 'working'}
        className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Building className="w-5 h-5 mr-2" />
        出勤
      </button>
      <button
        onClick={onClockInRemote}
        disabled={loading || status === 'working'}
        className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Monitor className="w-5 h-5 mr-2" />
        出勤（リモート）
      </button>
      <button
        onClick={onClockOut}
        disabled={loading || status !== 'working'}
        className="flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Timer className="w-5 h-5 mr-2" />
        退勤
      </button>
    </div>
    {isWithin30Minutes && status === 'working' && (
      <div className="flex justify-center">
        <button
          onClick={onEditClock}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          打刻時刻を修正（30分以内）
        </button>
      </div>
    )}
  </div>
);