import { apiClient } from './client'
import type { Page, Product, ProductRequest } from '../types'

export const productApi = {
  getAll: (params: { categoryId?: number; page?: number; size?: number } = {}) =>
    apiClient
      .get<Page<Product>>('/products', {
        params: {
          categoryId: params.categoryId,
          page: params.page ?? 0,
          size: params.size ?? 12,
        },
      })
      .then((res) => res.data),

  getById: (id: number) => apiClient.get<Product>(`/products/${id}`).then((res) => res.data),

  create: (data: ProductRequest) =>
    apiClient.post<Product>('/products', data).then((res) => res.data),

  update: (id: number, data: ProductRequest) =>
    apiClient.put<Product>(`/products/${id}`, data).then((res) => res.data),

  delete: (id: number) => apiClient.delete(`/products/${id}`),
}
