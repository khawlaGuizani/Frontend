// Interfaces pour les réponses et erreurs API

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
  timestamp?: string;
}

// Types pour les paramètres de requête communs
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  search?: string;
  filters?: Record<string, any>;
}

// Combinaisons fréquentes
export interface ListParams extends PaginationParams, SearchParams {}

// Types utilitaires pour les services
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiConfig {
  url: string;
  method: ApiMethod;
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}
