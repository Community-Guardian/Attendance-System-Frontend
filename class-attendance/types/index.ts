/**
 * Main export file for all types
 */

// Re-export all types
export * from './timetables';
export * from './courses';
export * from './attendance';
export * from './school';
export * from './user';
export * from './geolocation';
export * from './system';
export * from './reports';
export * from './api';
export * from './custom';

// Define common interfaces used across multiple modules
export interface BaseResponseType {
  message?: string;
  error?: string;
  status?: number;
  success?: boolean;
}

