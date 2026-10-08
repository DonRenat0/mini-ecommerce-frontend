import { apiClient } from './client'
import type { Category, CategoryRequest } from '../types'

export const categoryApi = {
  getAll: () => apiClient.get<Category[]>('/categories').then((res) => res.data),

  create: (data: CategoryRequest) =>
    apiClient.post<Category>('/categories', data).then((res) => res.data),
}
