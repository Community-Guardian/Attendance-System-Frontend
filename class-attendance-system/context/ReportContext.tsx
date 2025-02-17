"use client"
import { createContext, useContext, ReactNode, useState } from 'react';
import useApi from '@/hooks/useApi';
import { AttendanceReport, StudentAttendanceHistory, TimetableAdherence } from '@/types/reports';
import { ATTENDANCE_REPORT_URL, STUDENT_ATTENDANCE_HISTORY_URL, TIMETABLE_ADHERENCE_URL } from '@/handler/apiConfig';

interface ReportsContextProps {
  attendanceReports: AttendanceReport[];
  studentAttendanceHistory: StudentAttendanceHistory[];
  timetableAdherence: TimetableAdherence[];
  loading: boolean;
  error: string | null;
  fetchAttendanceReports: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchStudentAttendanceHistory: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchTimetableAdherence: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  // createAttendanceReport: (newReport: Partial<AttendanceReport>) => void;
  // updateAttendanceReport: (id: string, updatedData: Partial<AttendanceReport>) => void;
  // deleteAttendanceReport: (id: string) => void;
  // createStudentAttendanceHistory: (newHistory: Partial<StudentAttendanceHistory>) => void;
  // updateStudentAttendanceHistory: (id: string, updatedData: Partial<StudentAttendanceHistory>) => void;
  // deleteStudentAttendanceHistory: (id: string) => void;
  // createTimetableAdherence: (newAdherence: Partial<TimetableAdherence>) => void;
  // updateTimetableAdherence: (id: string, updatedData: Partial<TimetableAdherence>) => void;
  // deleteTimetableAdherence: (id: string) => void;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Record<string, string | number | undefined>) => void;
  setOrdering: (ordering: string) => void;
}

const ReportsContext = createContext<ReportsContextProps | undefined>(undefined);

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [ordering, setOrdering] = useState<string>('');

  const {
    data: attendanceReports,
    loading,
    error,
    fetchData: fetchAttendanceReports,
    addItem: createAttendanceReport,
    updateItem: updateAttendanceReport,
    deleteItem: deleteAttendanceReport,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  } = useApi<AttendanceReport>(ATTENDANCE_REPORT_URL);

  const {
    data: studentAttendanceHistory,
    fetchData: fetchStudentAttendanceHistory,
    addItem: createStudentAttendanceHistory,
    updateItem: updateStudentAttendanceHistory,
    deleteItem: deleteStudentAttendanceHistory,
  } = useApi<StudentAttendanceHistory>(STUDENT_ATTENDANCE_HISTORY_URL);

  const {
    data: timetableAdherence,
    fetchData: fetchTimetableAdherence,
    addItem: createTimetableAdherence,
    updateItem: updateTimetableAdherence,
    deleteItem: deleteTimetableAdherence,
  } = useApi<TimetableAdherence>(TIMETABLE_ADHERENCE_URL);

  const fetchReportsWithFilters = () => {
    fetchAttendanceReports(filters);
  };

  const fetchHistoryWithFilters = () => {
    fetchStudentAttendanceHistory(filters);
  };

  const fetchAdherenceWithFilters = () => {
    fetchTimetableAdherence(filters);
  };

  return (
    <ReportsContext.Provider
      value={{
        attendanceReports,
        studentAttendanceHistory,
        timetableAdherence,
        loading,
        error,
        fetchAttendanceReports: fetchReportsWithFilters,
        fetchStudentAttendanceHistory: fetchHistoryWithFilters,
        fetchTimetableAdherence: fetchAdherenceWithFilters,
        // createAttendanceReport,
        // updateAttendanceReport,
        // deleteAttendanceReport,
        // createStudentAttendanceHistory,
        // updateStudentAttendanceHistory,
        // deleteStudentAttendanceHistory,
        // createTimetableAdherence,
        // updateTimetableAdherence,
        // deleteTimetableAdherence,
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
    </ReportsContext.Provider>
  );
};

// Custom hook to use the ReportsContext
export const useReports = (): ReportsContextProps => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};