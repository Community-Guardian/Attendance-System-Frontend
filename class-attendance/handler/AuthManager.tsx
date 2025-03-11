import { LOGIN_URL, BASE_URL, REGISTER_URL, REFRESH_TOKEN_URL, USER_URL, LOGOUT_URL, CHANGE_PASSWORD_URL, RESEND_EMAIL_URL, RESET_PASSWORD_URL, VERIFY_TOKEN_URL } from '@/handler/apiConfig';
import { api, handleApiError } from '@/utils/api';
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { User } from '@/types';
import Cookies from 'js-cookie'; // Import js-cookie
import { promises } from 'dns';

export interface AuthResponse {
  access: string;
  refresh: string;
  user: Partial<User>;
}

interface ApiErrorResponse {
  detail?: string;
  [key: string]: unknown;
}

export const apiPlain = axios.create({
  baseURL: BASE_URL,
});

class AuthManager {
  async login(email: string, password: string): Promise<AuthResponse | undefined> {
    try {
        // Clear tokens synchronously before making the API call
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        const response = await apiPlain.post<AuthResponse>(LOGIN_URL, { email, password });

        // Store new tokens after successful login in cookies
        Cookies.set('accessToken', response.data.access, { expires: 1 }); // 1 day expiration
        Cookies.set('refreshToken', response.data.refresh, { expires: 7 }); // 7 days expiration

        return response.data;
    } catch (error) {
        handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async register(email: string, password1: string, password2: string, role: string): Promise<AuthResponse | undefined> {
    try {
      const response = await apiPlain.post<AuthResponse>(REGISTER_URL, { email, password1, password2, role });
      
      // Store new tokens after successful registration in cookies
      Cookies.set('accessToken', response.data.access, { expires: 1 }); // 1 day expiration
      Cookies.set('refreshToken', response.data.refresh, { expires: 7 }); // 7 days expiration
      
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async refreshToken(): Promise<AuthResponse | undefined> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found');
      const response = await apiPlain.post<AuthResponse>(REFRESH_TOKEN_URL, { refresh: refreshToken });
      
      // Store the new access token in cookies
      Cookies.set('accessToken', response.data.access, { expires: 1 });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await api.post(LOGOUT_URL, { refresh: refreshToken });
      }
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    } finally {
      // Remove tokens from cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  }

  async changePassword(new_password1: string, new_password2: string): Promise<void> {
    try {
      await api.post(CHANGE_PASSWORD_URL, { new_password1, new_password2 });
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async resendEmail(email: string): Promise<void> {
    try {
      await apiPlain.post(RESEND_EMAIL_URL, { email });
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await api.post(RESET_PASSWORD_URL, { email });
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async verifyToken(token: string): Promise<void> {
    try {
      await apiPlain.post(VERIFY_TOKEN_URL, { token });
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async getUser(){
    try {
      const response = await api.get(USER_URL);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      handleApiError(error as AxiosError<ApiErrorResponse>);
      throw error;
    }
  }

  async updateUser(userId: string, formData: FormData): Promise<any> {
    try {
      const response = await api.patch(`${USER_URL}${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      handleApiError(error as AxiosError<ApiErrorResponse>);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`${USER_URL}${userId}/`);
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      throw error;
    }
  }
}

const authManager = new AuthManager();
export default authManager;
