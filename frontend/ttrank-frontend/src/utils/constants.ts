export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REFRESH: '/api/auth/refresh/',
  },
  ATHLETES: {
    BASE: '/api/athletes/',
    IMPORT_CSV: '/api/athletes/import_csv/',
    EXPORT_CSV: '/api/athletes/export_csv/',
  }
} as const;

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export const CSV_TEMPLATE_HEADERS = [
  'full_name',
  'birth_date',
  'phone_number',
  'ranking_points',
  'club'
] as const;

export const CSV_TEMPLATE_EXAMPLE = [
  'John Doe,1990-01-15,+1234567890,1500,City Club',
  'Jane Smith,1985-03-22,+0987654321,1800,Sports Center',
  'Mike Johnson,1992-07-08,+1122334455,1200,'
] as const;