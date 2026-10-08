import { apiClient } from './client'
import type { Order, OrderRequest, OrderStatus, Page } from '../types'

export const orderApi = {
  create: (data: OrderRequest) => apiClient.post<Order>('/orders', data).then((res) => res.data),

  getMyOrders: (page = 0, size = 10) =>
    apiClient.get<Page<Order>>('/orders/my', { params: { page, size } }).then((res) => res.data),

  getById: (id: number) => apiClient.get<Order>(`/orders/${id}`).then((res) => res.data),

  getAll: (page = 0, size = 10) =>
    apiClient.get<Page<Order>>('/orders', { params: { page, size } }).then((res) => res.data),

  updateStatus: (id: number, status: OrderStatus) =>
    apiClient.patch<Order>(`/orders/${id}/status`, { status }).then((res) => res.data),
}
