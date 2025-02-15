"use client"
import { createContext, useContext, ReactNode, useState } from 'react';
import useApi from '@/hooks/useApi';
import { Department, Course } from '@/types/courses';
import { DEPARTMENT_URL, COURSE_URL } from '@/handler/apiConfig';

interface CoursesContextProps {
  departments: Department[];
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchDepartments: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  fetchCourses: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  createDepartment: (newDepartment: Partial<Department>) => void;
  updateDepartment: (id: string, updatedData: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  createCourse: (newCourse: Partial<Course>) => void;
  updateCourse: (id: string, updatedData: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Record<string, string | number | undefined>) => void;
  setOrdering: (ordering: string) => void;
}

const CoursesContext = createContext<CoursesContextProps | undefined>(undefined);

export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [ordering, setOrdering] = useState<string>('');

  const {
    data: departments,
    loading,
    error,
    fetchData: fetchDepartments,
    addItem: createDepartment,
    updateItem: updateDepartment,
    deleteItem: deleteDepartment,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  } = useApi<Department>(DEPARTMENT_URL);

  const {
    data: courses,
    fetchData: fetchCourses,
    addItem: createCourse,
    updateItem: updateCourse,
    deleteItem: deleteCourse,
  } = useApi<Course>(COURSE_URL);

  const fetchDepartmentsWithFilters = () => {
    fetchDepartments(filters);
  };

  const fetchCoursesWithFilters = () => {
    fetchCourses(filters);
  };

  return (
    <CoursesContext.Provider
      value={{
        departments,
        courses,
        loading,
        error,
        fetchDepartments: fetchDepartmentsWithFilters,
        fetchCourses: fetchCoursesWithFilters,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        createCourse,
        updateCourse,
        deleteCourse,
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
    </CoursesContext.Provider>
  );
};

// Custom hook to use the CoursesContext
export const useCourses = (): CoursesContextProps => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};