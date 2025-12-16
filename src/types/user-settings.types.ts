/**
 * User Settings Types
 * Types for user preferences and settings management
 */

// User settings data structure
export interface UserSettings {
  theme: number // 0 = Light, 1 = Dark
  culture: number // 0 = Vietnamese, 1 = English
}

// API response types (GET returns UserSettings directly)
export type GetUserSettingResponse = UserSettings

// API request types (PUT request body)
export type SetUserSettingRequest = UserSettings
