import { BaseModel } from './base'
import type { Department, Programme } from './school'

export type UserRole = 'student' | 'lecturer' | 'hod' | 'dean' | 'config_user' | 'admin'

export interface User extends BaseModel {
  email: string
  role: UserRole
  phone_number?: string
  student_id?: string
  employee_id?: string
  first_name?: string
  last_name?: string
  is_verified: boolean
  registered_face?: string
  department?: Department
  programme?: Programme
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}