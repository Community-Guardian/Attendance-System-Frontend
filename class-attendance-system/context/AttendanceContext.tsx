"use client"
import { createContext, useContext, ReactNode, useState } from 'react';
import useApi from '@/hooks/useApi';
import { AttendanceSession, AttendanceRecord } from '@/types/attendance';
import { ATTENDANCE_SESSION_URL, ATTENDANCE_RECORD_URL } from '@/handler/apiConfig';

interface AttendanceContextProps {
  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  fetchAttendanceSessions: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchAttendanceRecords: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  createAttendanceSession: (newSession: Partial<AttendanceSession>) => void;
  updateAttendanceSession: (id: string, updatedData: Partial<AttendanceSession>) => void;
  deleteAttendanceSession: (id: string) => void;
  createAttendanceRecord: (newRecord: Partial<AttendanceRecord>) => void;
  updateAttendanceRecord: (id: string, updatedData: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (id: string) => void;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Record<string, string | number | undefined>) => void;
  setOrdering: (ordering: string) => void;
}

const AttendanceContext = createContext<AttendanceContextProps | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [ordering, setOrdering] = useState<string>('');

  const {
    data: attendanceSessions,
    loading,
    error,
    fetchData: fetchAttendanceSessions,
    addItem: createAttendanceSession,
    updateItem: updateAttendanceSession,
    deleteItem: deleteAttendanceSession,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  } = useApi<AttendanceSession>(ATTENDANCE_SESSION_URL);

  const {
    data: attendanceRecords,
    fetchData: fetchAttendanceRecords,
    addItem: createAttendanceRecord,
    updateItem: updateAttendanceRecord,
    deleteItem: deleteAttendanceRecord,
  } = useApi<AttendanceRecord>(ATTENDANCE_RECORD_URL);

  const fetchSessionsWithFilters = () => {
    fetchAttendanceSessions(filters);
  };

  const fetchRecordsWithFilters = () => {
    fetchAttendanceRecords(filters);
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceSessions,
        attendanceRecords,
        loading,
        error,
        fetchAttendanceSessions: fetchSessionsWithFilters,
        fetchAttendanceRecords: fetchRecordsWithFilters,
        createAttendanceSession,
        updateAttendanceSession,
        deleteAttendanceSession,
        createAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        setPageSize,
        setFilters,
        setOrdering,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

// Custom hook to use the AttendanceContext
export const useAttendance = (): AttendanceContextProps => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};