import { Department, Programme } from './school';
/**
 * Types for User Manager app models and serializers
 */

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: 'student' | 'lecturer' | 'admin' | 'hod' | 'dean';
  student_id?: string;
  employee_id?: string;
  department?: Department;
  programme?: Programme;
  date_joined: string;
  is_verified: boolean;
  registered_face?: string;
}

export interface RegisterRequest {
  email: string;
  password1: string;
  password2: string;
  role: 'student' | 'lecturer' | 'admin' | 'hod' | 'dean';
  phone_number?: string;
  student_id?: string;
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  registered_face?: File;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenVerifyRequest {
  token: string;
}

export interface PasswordChangeRequest {
  new_password1: string;
  new_password2: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  uid: string;
  new_password1: string;
  new_password2: string;
}

export interface ResendEmailRequest {
  email: string;
}

export interface MassRegisterRequest {
  users: RegisterRequest[];
}