export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errorMessage: string;
  errorCode: string;
  httpErrorCode: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  errorMessage: string;
  errorCode: string;
  httpErrorCode: string;
}
