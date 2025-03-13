import { BaseModel } from './base'
import { User } from './user'

export interface School extends BaseModel {
  name: string
  dean: string
  dean_id?: string
  total_departments: number
  total_programmes: number
  total_students: number
  total_lecturers: number
  departments: Department[]
}

export interface Department extends BaseModel {
  name: string
  school: string
  school_id?: string
  hod: string
  total_programmes: number
  total_students: number
  total_lecturers: number
  programmes: Programme[]
}

export interface Programme extends BaseModel {
  name: string
  department: string
  department_id?: string
  total_students: number
  class_groups: ClassGroup[]
}

export interface ClassGroup extends BaseModel {
  name: string
  programme: string
  programme_id?: string
  year: number
  total_students: number
}

export interface AcademicYear extends BaseModel {
  name: string
  start_date: string
  end_date: string
  is_current: boolean
  active_semesters: Semester[]
}

export interface Semester extends BaseModel {
  name: string
  academic_year: string
  academic_year_id?: string
  start_date: string
  end_date: string
  is_current: boolean
  duration: number
}
