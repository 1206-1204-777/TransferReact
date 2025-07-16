// src/types/index.ts
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

// Tabインターフェースは元のコードにも存在しましたが、念のため含めます
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

// 修正申請の型定義を一つに統合
// - userId を必須プロパティとして追加
// - status の型を小文字の文字列リテラルに統一
// - approver と changes をオプションプロパティに変更
export interface EditRequest {
  id: number;
  userId: number; // ユーザーID (必須)
  requestDate: string;
  targetDate: string;
  changes?: string; // 修正内容の要約 (オプション)
  reason: string;
  status: 'approved' | 'pending' | 'rejected'; // ステータス (承認済み, 申請中, 却下)
  approver?: string; // 承認者名 (オプション)
  currentClockIn?: string; // 修正前の出勤時刻 (オプション)
  requestedClockIn?: string; // 修正後の出勤時刻 (オプション)
  currentClockOut?: string; // 修正前の退勤時刻 (オプション)
  requestedClockOut?: string; // 修正後の退勤時刻 (オプション)
  approvedDate?: string; // 承認日 (オプション)
  approverId?: number; // 承認者のID (オプション)
}

export interface HolidayRequest {
  createdAt: string | number | Date;
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
  startTime?: string | null;
  endTime?: string | null;
  reason?: string;
  comment?: string;
}

// 勤怠修正申請DTO (バックエンドに送信するデータ構造)
export interface CorrectionRequestDto {
  userId: number;
  targetDate: string;
  requestedClockIn?: string;
  requestedClockOut?: string;
  reason: string;
  // comment は UserAttendanceUpdateRequestDto にあるが、CorrectionRequestDto には通常ないため注意
  // 必要であれば追加
}
export interface CorrectionRequestDto {
  userId: number;
  targetDate: string;
  requestedClockIn?: string;
  requestedClockOut?: string;
  reason: string;
}

// 休日申請関連
export interface PersonalHolidayRequest {
  userId: number;
  holidayDate: string;
  holidayType: 'PAID' | 'SPECIAL' | 'SICK' | 'OTHER';
  reason: string;
}

export interface PersonalHolidayResponse {
  id: number;
  userId: number;
  username: string;
  holidayDate: string;
  holidayType: string;
  reason: string;
  status: string;
  approverName: string;
  createdAt: string;
  updatedAt: string;
}

// 残業申請関連
export interface OvertimeRequestDto {
  userId: number;
  targetDate: string;
  startTime: string;
  endTime: string;
  reason: string;
}