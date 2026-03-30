export const env = {
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  port: Number(process.env.PORT || 4000),
  cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',
};
