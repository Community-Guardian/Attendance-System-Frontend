"use client"
import { createContext, useContext, ReactNode, useState } from 'react';
import useApi from '@/hooks/useApi';
import { Timetable, TimetablePDF } from '@/types/timetables';
import { TIMETABLE_URL, TIMETABLE_PDF_URL } from '@/handler/apiConfig';

interface TimetableContextProps {
  timetables: Timetable[];
  timetablePDFs: TimetablePDF[];
  loading: boolean;
  error: string | null;
  fetchTimetables: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchTimetablePDFs: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  createTimetable: (newTimetable: Partial<Timetable>) => void;
  updateTimetable: (id: string, updatedData: Partial<Timetable>) => void;
  deleteTimetable: (id: string) => void;
  uploadTimetablePDF: (newPDF: Partial<TimetablePDF>) => void;
  deleteTimetablePDF: (id: string) => void;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Record<string, string | number | undefined>) => void;
  setOrdering: (ordering: string) => void;
}

const TimetableContext = createContext<TimetableContextProps | undefined>(undefined);

export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [ordering, setOrdering] = useState<string>('');

  const {
    data: timetables,
    loading,
    error,
    fetchData: fetchTimetables,
    addItem: createTimetable,
    updateItem: updateTimetable,
    deleteItem: deleteTimetable,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  } = useApi<Timetable>(TIMETABLE_URL);

  const {
    data: timetablePDFs,
    fetchData: fetchTimetablePDFs,
    addItem: uploadTimetablePDF,
    deleteItem: deleteTimetablePDF,
  } = useApi<TimetablePDF>(TIMETABLE_PDF_URL);

  const fetchTimetablesWithFilters = () => {
    fetchTimetables(filters);
  };

  const fetchTimetablePDFsWithFilters = () => {
    fetchTimetablePDFs(filters);
  };

  return (
    <TimetableContext.Provider
      value={{
        timetables,
        timetablePDFs,
        loading,
        error,
        fetchTimetables: fetchTimetablesWithFilters,
        fetchTimetablePDFs: fetchTimetablePDFsWithFilters,
        createTimetable,
        updateTimetable,
        deleteTimetable,
        uploadTimetablePDF,
        deleteTimetablePDF,
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
    </TimetableContext.Provider>
  );
};

// Custom hook to use the TimetableContext
export const useTimetable = (): TimetableContextProps => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};