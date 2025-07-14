// src/utils/constants.ts
import { AttendanceRecord, EditRequest, HolidayRequest, Location, OvertimeRequest, User } from '../types';

// モックデータ
export const initialMockUser: User = {
  id: 1,
  name: '山田 太郎',
  department: '開発部',
  avatar: '🧑‍💻'
};

export const initialMockTodayAttendance: AttendanceRecord = {
  date: new Date().toISOString().split('T')[0],
  scheduledTime: '09:00 ～ 18:00 （実労働: 8時間）',
  clockIn: null,
  clockOut: null,
  workHours: '0時間0分',
  overtime: '0分',
  breakHours: '0時間（自動）',
  status: 'complete',
  isWithin30Minutes: false
};

export const initialMockAttendanceHistory: AttendanceRecord[] = [
  {
    date: '2025-06-15',
    clockIn: '09:10',
    clockOut: '18:30',
    workHours: '8時間20分',
    overtime: '30分',
    breakHours: '1時間',
    status: 'complete'
  },
  {
    date: '2025-06-14',
    clockIn: '09:05',
    clockOut: '19:15',
    workHours: '9時間10分',
    overtime: '1時間10分',
    breakHours: '1時間',
    status: 'complete'
  },
  {
    date: '2025-06-13',
    clockIn: '08:55',
    clockOut: '18:00',
    workHours: '8時間5分',
    overtime: '0分',
    breakHours: '1時間',
    status: 'complete'
  }
];

// EditRequest の型変更に合わせて userId を追加し、関連プロパティも追加
export const initialMockEditHistory: EditRequest[] = [];


export const initialMockHolidayRequests: HolidayRequest[] = [
  {
    id: 1,
    requestDate: '2025-06-15',
    holidayDate: '2025-06-20',
    type: 'paid',
    status: 'pending',
    approver: '-'
  },
  {
    id: 2,
    requestDate: '2025-06-14',
    holidayDate: '2025-06-25',
    type: 'sick',
    status: 'pending',
    approver: '-'
  }
];

export const initialMockOvertimeRequests: OvertimeRequest[] = [
  {
    id: 1,
    requestDate: '2025-06-15',
    targetDate: '2025-06-20',
    startTime: '18:00',
    endTime: '20:00',
    reason: 'システム障害対応',
    status: 'pending',
    approver: '-'
  },
  {
    id: 2,
    requestDate: '2025-06-14',
    targetDate: '2025-06-18',
    startTime: '19:00',
    endTime: '21:30',
    reason: 'プロジェクト締切対応',
    status: 'approved',
    approver: '鈴木 部長'
  }
];

export const initialMockLocations: Location[] = [
  {
    id: 1,
    name: '東京オフィス',
    startTime: '09:00',
    endTime: '18:00',
    creator: '山田 太郎'
  },
  {
    id: 2,
    name: '大阪オフィス',
    startTime: '09:30',
    endTime: '18:30',
    creator: '山田 太郎'
  },
  {
    id: 3,
    name: '名古屋オフィス',
    startTime: '09:00',
    endTime: '17:30',
    creator: '山田 太郎'
  }
];
