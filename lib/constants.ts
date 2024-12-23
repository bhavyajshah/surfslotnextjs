
export const AUTH_CONFIG = {
  GOOGLE_SCOPES: [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly'
  ]
}

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  AUTH: {
    SIGNIN: '/auth/signin',
    ERROR: '/auth/error'
  }
}