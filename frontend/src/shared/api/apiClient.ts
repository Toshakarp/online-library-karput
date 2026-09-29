import { ApiResponse } from 'shared-types';
import { useAuthStore } from '@/app/store/useAuthStore';

export interface ApiError extends Error {
  code: string;
  status: number;
}

export const createApiError = (
  message: string,
  code: string,
  status: number
): ApiError =>
  Object.assign(new Error(message), {
    name: 'ApiError',
    code,
    status,
  });

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(
  /\/+$/,
  ''
);

type ErrorHandler = (message: string) => void;

let onGlobalApiError: ErrorHandler | null = null;

export const setApiErrorHandler = (fn: ErrorHandler | null) => {
  onGlobalApiError = fn;
};

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers' | 'method'> {
  params?: QueryParams;
  headers?: Record<string, string>;
}

interface RequestConfig extends RequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
}

const buildUrl = (path: string, params?: QueryParams): string => {
  const normalizedPath = path.startsWith('/api/')
    ? path.slice(4)
    : path.startsWith('/')
      ? path
      : `/${path}`;

  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  return `${BASE_URL}${normalizedPath}${queryString ? `?${queryString}` : ''}`;
};

const buildHeaders = (
  customHeaders?: Record<string, string>,
  hasJsonBody?: boolean
): Record<string, string> => {
  const token = useAuthStore.getState().token;

  return {
    ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
};

const serializeBody = (body?: unknown): BodyInit | undefined => {
  if (body === undefined) return undefined;
  return body instanceof FormData ? body : JSON.stringify(body);
};

const request = async <T>(path: string, config: RequestConfig): Promise<T> => {
  const { params, body, headers, ...restConfig } = config;
  const isFormData = body instanceof FormData;
  const hasJsonBody = body !== undefined && !isFormData;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      ...restConfig,
      headers: buildHeaders(headers, hasJsonBody),
      body: serializeBody(body),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    onGlobalApiError?.(message);
    throw createApiError(message, 'NETWORK_ERROR', 0);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T;
  }

  const text = await response.text();
  if (!text && response.ok) {
    return null as T;
  }

  let payload: ApiResponse<T> | null = null;
  if (text) {
    try {
      payload = JSON.parse(text) as ApiResponse<T>;
    } catch {
      payload = null;
    }
  }

  if (!response.ok || !payload?.success) {
    const code = payload?.error?.code ?? 'UNKNOWN_ERROR';
    const message = payload?.error?.message ?? `HTTP ${response.status}`;

    if (response.status >= 500) {
      onGlobalApiError?.(message);
    }

    throw createApiError(message, code, response.status);
  }

  return payload.data as T;
};

export const apiClient = {
  get: <T>(path: string, params?: QueryParams, options?: Omit<RequestOptions, 'params'>) =>
    request<T>(path, { ...options, method: 'GET', params }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
