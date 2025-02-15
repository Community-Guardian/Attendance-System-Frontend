"use client"
import { createContext, useContext, ReactNode, useState } from 'react';
import useApi from '@/hooks/useApi';
import { SystemSetting, CatAttendanceWeek, TimetableRule, AuditLog } from '@/types/config';
import { SYSTEM_SETTINGS_URL, CAT_ATTENDANCE_WEEK_URL, TIMETABLE_RULE_URL, AUDIT_LOG_URL } from '@/handler/apiConfig';

interface ConfigContextProps {
  systemSettings: SystemSetting[];
  catAttendanceWeeks: CatAttendanceWeek[];
  timetableRules: TimetableRule[];
  auditLogs: AuditLog[];
  loading: boolean;
  error: string | null;
  fetchSystemSettings: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchCatAttendanceWeeks: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchTimetableRules: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchAuditLogs: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  createSystemSetting: (newSetting: Partial<SystemSetting>) => void;
  updateSystemSetting: (id: string, updatedData: Partial<SystemSetting>) => void;
  deleteSystemSetting: (id: string) => void;
  createCatAttendanceWeek: (newWeek: Partial<CatAttendanceWeek>) => void;
  updateCatAttendanceWeek: (id: string, updatedData: Partial<CatAttendanceWeek>) => void;
  deleteCatAttendanceWeek: (id: string) => void;
  createTimetableRule: (newRule: Partial<TimetableRule>) => void;
  updateTimetableRule: (id: string, updatedData: Partial<TimetableRule>) => void;
  deleteTimetableRule: (id: string) => void;
  createAuditLog: (newLog: Partial<AuditLog>) => void;
  updateAuditLog: (id: string, updatedData: Partial<AuditLog>) => void;
  deleteAuditLog: (id: string) => void;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Record<string, string | number | undefined>) => void;
  setOrdering: (ordering: string) => void;
}

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [ordering, setOrdering] = useState<string>('');

  const {
    data: systemSettings,
    loading,
    error,
    fetchData: fetchSystemSettings,
    addItem: createSystemSetting,
    updateItem: updateSystemSetting,
    deleteItem: deleteSystemSetting,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  } = useApi<SystemSetting>(SYSTEM_SETTINGS_URL);

  const {
    data: catAttendanceWeeks,
    fetchData: fetchCatAttendanceWeeks,
    addItem: createCatAttendanceWeek,
    updateItem: updateCatAttendanceWeek,
    deleteItem: deleteCatAttendanceWeek,
  } = useApi<CatAttendanceWeek>(CAT_ATTENDANCE_WEEK_URL);

  const {
    data: timetableRules,
    fetchData: fetchTimetableRules,
    addItem: createTimetableRule,
    updateItem: updateTimetableRule,
    deleteItem: deleteTimetableRule,
  } = useApi<TimetableRule>(TIMETABLE_RULE_URL);

  const {
    data: auditLogs,
    fetchData: fetchAuditLogs,
    addItem: createAuditLog,
    updateItem: updateAuditLog,
    deleteItem: deleteAuditLog,
  } = useApi<AuditLog>(AUDIT_LOG_URL);

  const fetchSystemSettingsWithFilters = () => {
    fetchSystemSettings(filters);
  };

  const fetchCatAttendanceWeeksWithFilters = () => {
    fetchCatAttendanceWeeks(filters);
  };

  const fetchTimetableRulesWithFilters = () => {
    fetchTimetableRules(filters);
  };

  const fetchAuditLogsWithFilters = () => {
    fetchAuditLogs(filters);
  };

  return (
    <ConfigContext.Provider
      value={{
        systemSettings,
        catAttendanceWeeks,
        timetableRules,
        auditLogs,
        loading,
        error,
        fetchSystemSettings: fetchSystemSettingsWithFilters,
        fetchCatAttendanceWeeks: fetchCatAttendanceWeeksWithFilters,
        fetchTimetableRules: fetchTimetableRulesWithFilters,
        fetchAuditLogs: fetchAuditLogsWithFilters,
        createSystemSetting,
        updateSystemSetting,
        deleteSystemSetting,
        createCatAttendanceWeek,
        updateCatAttendanceWeek,
        deleteCatAttendanceWeek,
        createTimetableRule,
        updateTimetableRule,
        deleteTimetableRule,
        createAuditLog,
        updateAuditLog,
        deleteAuditLog,
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
    </ConfigContext.Provider>
  );
};

// Custom hook to use the ConfigContext
export const useConfig = (): ConfigContextProps => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};