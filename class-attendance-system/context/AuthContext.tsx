"use client"
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authManager from '@/handler/AuthManager'; // Path to AuthManager
import { AxiosError } from 'axios';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null; // Replace with your user type
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password1: string, password2: string, role: string) => Promise<User>;
  logout: () => Promise<void>;
  changePassword: (newPassword1: string, newPassword2: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Store user information
  const [loading, setLoading] = useState<boolean>(true); // Start in a loading state
  const [error, setError] = useState<string | null>(null);
  // Innocent until proven guilty LOL
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for the accessToken in cookies only on the client-side
    const token = Cookies.get('accessToken');
    setIsAuthenticated(!!token);  // Set state based on whether the token exists
  }, []);  
  const router = useRouter();

  // Fetch user data on load
  useEffect(() => {
    const fetchUserOnLoad = async () => {
      try {
        if(Cookies.get('accessToken')) {
          // Fetch user data
          await getUser();
          setIsAuthenticated(true);
        }    
      } catch (err) {
        console.error('Failed to fetch user on load:', err);
        setError('Failed to authenticate. Please log in again.');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // End the loading state
      }
    };
    fetchUserOnLoad();
  }, []);
  // create redirect function
  function redirect(userType: string) {
    if(Cookies.get('accessToken')) { // Redirect based on user type
      if (userType === "customer") {
        router.push("/dashboard")
      } else if (userType === "admin") {
        router.push("/")
      } else {
        router.push("/login")
      }
    }
  }
  // Handle login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authManager.login(email, password);
      setIsAuthenticated(true); // Set to authenticated after successful login
      const userData = await authManager.getUser();
      setUser(userData.results[0]);
      return userData.results[0]

    } catch (err: any) {
      setError(err.email || err.password || 'Wrong username or password. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // Handle registration
  const register = async (email: string, password1: string, password2: string, role: string) => {
    setLoading(true);
    try {
      const data = await authManager.register(email, password1, password2, role);    
      setIsAuthenticated(true); // Set to authenticated after successful login
      const userData = await authManager.getUser();
      setUser(userData.results[0]);
      return userData.results[0]
    } catch (err: any) {
      setError(err.email || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    setLoading(true);
    try {
      await authManager.logout();
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setIsAuthenticated(false); // Set to false on logout
    } catch (err) {
      setError((err as AxiosError).message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Change user password
  const changePassword = async (newPassword1: string, newPassword2: string) => {
    setLoading(true);
    try {
      await authManager.changePassword(newPassword1, newPassword2);
    } catch (err) {
      setError((err as AxiosError).message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  // Reset user password
  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await authManager.resetPassword(email);
    } catch (err) {
      setError((err as AxiosError).message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  // Get user data
  const getUser = async () => {
    try {
        // Fetch user data
        const userData = await authManager.getUser();
        setUser(userData.results[0]);
    } catch (err) {
      console.error('Failed to fetch user on load:', err);
      setError('Failed to authenticate. Please log in again.');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // End the loading state
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        setIsAuthenticated,
        login,
        register,
        logout,
        changePassword,
        resetPassword,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// Custom hook to use the Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};