export declare interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  skip: number;
}
