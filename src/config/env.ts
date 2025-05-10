import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/luna-joy',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
} as const;
