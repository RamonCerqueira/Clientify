export const env = {
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  port: Number(process.env.PORT || 4000),
};
