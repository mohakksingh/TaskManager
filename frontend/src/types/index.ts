export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'OPEN' | 'DONE';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}
