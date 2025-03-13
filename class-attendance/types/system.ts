import { BaseModel } from './base'
import type { User } from './user'

export interface SystemSetting extends BaseModel {
  key: string
  value: string
  description: string
}

export interface CatAttendanceWeek extends BaseModel {
  start_date: string
  end_date: string
  is_active: boolean
}

export interface TimetableRule extends BaseModel {
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export interface AuditLog extends BaseModel {
  user: User
  user_id?: string
  action: string
  details: string
  ip_address: string
}