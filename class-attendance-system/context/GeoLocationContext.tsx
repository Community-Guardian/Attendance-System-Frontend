"use client"
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import useApi from '@/hooks/useApi';
import { GeolocationZone } from '@/types/geolocation';
import { GEOLOCATION_ZONE_URL } from '@/handler/apiConfig';

interface GeolocationContextProps {
  geolocationZones: GeolocationZone[];
  loading: boolean;
  error: string | null;
  fetchGeolocationZones: (filters?: Record<string, string | number | undefined>, ordering?: string) => void;
  createGeolocationZone: (newZone: Partial<GeolocationZone>) => void;
  updateGeolocationZone: (id: string, updatedData: Partial<GeolocationZone>) => void;
  deleteGeolocationZone: (id: string) => void;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Record<string, string | number | undefined>) => void;
  setOrdering: (ordering: string) => void;
  location: { latitude: number; longitude: number } | null;
  requestLocationPermission: () => void;
}

const GeolocationContext = createContext<GeolocationContextProps | undefined>(undefined);

export const GeolocationProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});
  const [ordering, setOrdering] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const {
    data: geolocationZones,
    loading,
    error,
    fetchData: fetchGeolocationZones,
    addItem: createGeolocationZone,
    updateItem: updateGeolocationZone,
    deleteItem: deleteGeolocationZone,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  } = useApi<GeolocationZone>(GEOLOCATION_ZONE_URL);

  const fetchGeolocationZonesWithFilters = () => {
    fetchGeolocationZones(filters);
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obtaining location", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <GeolocationContext.Provider
      value={{
        geolocationZones,
        loading,
        error,
        fetchGeolocationZones: fetchGeolocationZonesWithFilters,
        createGeolocationZone,
        updateGeolocationZone,
        deleteGeolocationZone,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        setPageSize,
        setFilters,
        setOrdering,
        location,
        requestLocationPermission,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
};

// Custom hook to use the GeolocationContext
export const useGeolocation = (): GeolocationContextProps => {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
};