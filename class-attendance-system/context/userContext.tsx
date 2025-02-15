"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useApi from '@/hooks/useApi';
import { User } from '@/types';

interface UserContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => void;
  updateUser: (id: string, updatedData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error, fetchData, fetchById, updateItem, deleteItem } = useApi<User>('api/users/');

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (data.length > 0) {
      setUser(data[0]); // Set the first user if available
    }
  }, [data]);

  const fetchUser = () => {
    fetchData();
  };

  const updateUser = async (id: string, updatedData: Partial<User>) => {
    try {
      await updateItem(id, updatedData);
      await fetchById(id); // Refresh user data after update
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteItem(id);
      setUser(null); // Clear user data after deletion
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        fetchUser,
        updateUser,
        deleteUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};