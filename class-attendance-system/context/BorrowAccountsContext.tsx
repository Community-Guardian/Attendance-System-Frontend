"use client"
import { createContext, useContext, ReactNode, useState } from 'react';
import useApi from '@/hooks/useApi';
import { BorrowAccount, FacialRecognitionData, BorrowedAttendanceRecord } from '@/types/borrow_accounts';
import { BORROW_ACCOUNT_URL, FACIAL_RECOGNITION_DATA_URL, BORROWED_ATTENDANCE_RECORD_URL } from '@/handler/apiConfig';

interface BorrowAccountsContextProps {
  borrowAccounts: BorrowAccount[];
  facialRecognitionData: FacialRecognitionData[];
  borrowedAttendanceRecords: BorrowedAttendanceRecord[];
  loading: boolean;
  error: string | null;
  fetchBorrowAccounts: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchFacialRecognitionData: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchBorrowedAttendanceRecords: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  createBorrowAccount: (newAccount: Partial<BorrowAccount>) => void;
  updateBorrowAccount: (id: string, updatedData: Partial<BorrowAccount>) => void;
  deleteBorrowAccount: (id: string) => void;
  createFacialRecognitionData: (newData: Partial<FacialRecognitionData>) => void;
  updateFacialRecognitionData: (id: string, updatedData: Partial<FacialRecognitionData>) => void;
  deleteFacialRecognitionData: (id: string) => void;
  createBorrowedAttendanceRecord: (newRecord: Partial<BorrowedAttendanceRecord>) => void;
  updateBorrowedAttendanceRecord: (id: string, updatedData: Partial<BorrowedAttendanceRecord>) => void;
  deleteBorrowedAttendanceRecord: (id: string) => void;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Record<string, string | number | undefined>) => void;
  setOrdering: (ordering: string) => void;
}

const BorrowAccountsContext = createContext<BorrowAccountsContextProps | undefined>(undefined);

export const BorrowAccountsProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [ordering, setOrdering] = useState<string>('');

  const {
    data: borrowAccounts,
    loading,
    error,
    fetchData: fetchBorrowAccounts,
    addItem: createBorrowAccount,
    updateItem: updateBorrowAccount,
    deleteItem: deleteBorrowAccount,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  } = useApi<BorrowAccount>(BORROW_ACCOUNT_URL);

  const {
    data: facialRecognitionData,
    fetchData: fetchFacialRecognitionData,
    addItem: createFacialRecognitionData,
    updateItem: updateFacialRecognitionData,
    deleteItem: deleteFacialRecognitionData,
  } = useApi<FacialRecognitionData>(FACIAL_RECOGNITION_DATA_URL);

  const {
    data: borrowedAttendanceRecords,
    fetchData: fetchBorrowedAttendanceRecords,
    addItem: createBorrowedAttendanceRecord,
    updateItem: updateBorrowedAttendanceRecord,
    deleteItem: deleteBorrowedAttendanceRecord,
  } = useApi<BorrowedAttendanceRecord>(BORROWED_ATTENDANCE_RECORD_URL);

  const fetchBorrowAccountsWithFilters = () => {
    fetchBorrowAccounts(filters);
  };

  const fetchFacialRecognitionDataWithFilters = () => {
    fetchFacialRecognitionData(filters);
  };

  const fetchBorrowedAttendanceRecordsWithFilters = () => {
    fetchBorrowedAttendanceRecords(filters);
  };

  return (
    <BorrowAccountsContext.Provider
      value={{
        borrowAccounts,
        facialRecognitionData,
        borrowedAttendanceRecords,
        loading,
        error,
        fetchBorrowAccounts: fetchBorrowAccountsWithFilters,
        fetchFacialRecognitionData: fetchFacialRecognitionDataWithFilters,
        fetchBorrowedAttendanceRecords: fetchBorrowedAttendanceRecordsWithFilters,
        createBorrowAccount,
        updateBorrowAccount,
        deleteBorrowAccount,
        createFacialRecognitionData,
        updateFacialRecognitionData,
        deleteFacialRecognitionData,
        createBorrowedAttendanceRecord,
        updateBorrowedAttendanceRecord,
        deleteBorrowedAttendanceRecord,
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
    </BorrowAccountsContext.Provider>
  );
};

// Custom hook to use the BorrowAccountsContext
export const useBorrowAccounts = (): BorrowAccountsContextProps => {
  const context = useContext(BorrowAccountsContext);
  if (!context) {
    throw new Error('useBorrowAccounts must be used within a BorrowAccountsProvider');
  }
  return context;
};