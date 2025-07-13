// 型定義
export interface User {
  id: number;
  name: string;
  department: string;
  avatar: string;
}

export interface AttendanceRecord {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  workHours: string;
  overtime: string;
  breakHours: string;
  status: 'complete' | 'working' | 'breaking';
  scheduledTime?: string; 
  isWithin30Minutes?: boolean;
}

export interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

export interface Tab {
  id: string;
  label: string;
}

export interface Schedule {
  [key: string]: {
    type: string;
    startTime: string;
    endTime: string;
  };
}

export interface EditRequest {
  id: number;
  requestDate: string;
  targetDate: string;
  changes: string;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
  approver: string;
}

export interface HolidayRequest {
  id: number;
  requestDate: string;
  holidayDate: string;
  type: 'paid' | 'sick' | 'special' | 'other';
  status: 'approved' | 'pending' | 'rejected';
  approver: string;
}

export interface OvertimeRequest {
  id: number;
  requestDate: string;
  targetDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
  approver: string;
}

export interface Location {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  creator: string;
}

export interface ClockInRequestDto {
  userId: number;
  type: 'WORK' | 'REMOTE';
}

export interface UserAttendanceUpdateRequestDto {
  userId: number;
  date: string;
  clockIn?: string | null;
  clockOut?: string | null;
  reason?: string;
  comment?: string;
}
