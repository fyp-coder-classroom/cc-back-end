export type PaginationFilters<T> = Partial<{
  [K in keyof T]: string | number;
}>;

export interface PaginationOptions {
  limit?: string;
  page?: string;
  sortBy?: string;
  populate?: string;
}
