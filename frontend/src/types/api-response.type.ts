export type ApiError = {
  message: string;
  statusCode?: number;
  error?: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

