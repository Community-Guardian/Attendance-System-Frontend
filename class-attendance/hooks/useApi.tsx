import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { api, handleApiError } from '@/utils/api';

interface ApiResponse<T> {
  count: number;
  next: null | string;
  previous: null | string;
  results: T[];
}

interface ApiErrorResponse {
  detail?: string;
  [key: string]: unknown;
}

function useApi<T>(url: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const buildQueryParams = (params: Record<string, string | number>) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        queryParams.append(key, String(params[key]));
      }
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : '';
  };

  const fetchData = async (filters?: Record<string, string | number | undefined>) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = buildQueryParams({
        ...filters,
        page: currentPage,
        page_size: pageSize,
      });

      const response = await api.get<ApiResponse<T>>(`${url}${queryString}`);
      setData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (err) {
      handleApiError(err as AxiosError<ApiErrorResponse>);
      setError('Failed to fetch data');
      throw err
    } finally {
      setLoading(false);
    }
  };

  const fetchById = async (id:  string | number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<T>(`${url}${id}/`);
      return response.data;
    } catch (err) {
      handleApiError(err as AxiosError<ApiErrorResponse>);
      setError('Failed to fetch item');
      throw err
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<T>(url, item);
      setData((prevData) => [response.data, ...prevData]); // Add new item to the beginning
    } catch (err) {
      handleApiError(err as AxiosError<ApiErrorResponse>);
      setError('Failed to add item');
      throw err
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id:  string | number, item: Partial<T>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<T>(`${url}${id}/`, item);
      setData((prevData) => prevData.map((d) => (d as any).id === id ? response.data : d));
    } catch (err) {
      handleApiError(err as AxiosError<ApiErrorResponse>);
      setError('Failed to update item');
      throw err
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id:  string | number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`${url}${id}/`);
      setData((prevData) => prevData.filter((d) => (d as any).id !== id));
    } catch (err) {
      handleApiError(err as AxiosError<ApiErrorResponse>);
      setError('Failed to delete item');
      throw err
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, [url, currentPage, pageSize]);

  return {
    data,
    loading,
    error,
    fetchData,
    fetchById,
    addItem,
    updateItem,
    deleteItem,
    nextPage,
    prevPage,
    goToPage,
    currentPage,
    totalPages,
    setPageSize,
  };
}

export default useApi;
