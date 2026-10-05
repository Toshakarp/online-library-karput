if (typeof (process as any).loadEnvFile === 'function') {
  try {
    (process as any).loadEnvFile();
  } catch (error: any) {
    if (error?.code !== 'ENOENT') {
      console.warn(`[Config] Ошибка чтения .env файла: ${error?.message || error}`);
    }
  }
}

export interface EnvConfig {
  PORT: number;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  OPEN_LIBRARY_BASE_URL: string;
  FRONTEND_ORIGIN: string;
}

function getEnv(key: string, defaultValue: string = ''): string {
  const value = process.env[key];

  if (value) {
    return value;
  }

  if (defaultValue) {
    return defaultValue;
  }

  console.warn(`[Config] Переменная окружения ${key} не найдена. Используем пустую строку.`);
  return '';
}

export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  SUPABASE_URL: getEnv('SUPABASE_URL', 'supabase_url'),
  SUPABASE_SERVICE_KEY: getEnv('SUPABASE_SERVICE_KEY', 'placeholder-service-key-for-dev'),
  JWT_SECRET: getEnv('JWT_SECRET', 'secret_dev_jwt_key_123456789'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '1d'),
  OPEN_LIBRARY_BASE_URL: getEnv('OPEN_LIBRARY_BASE_URL', 'https://openlibrary.org'),
  FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', '*'),
};
