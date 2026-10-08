import { useEffect, useState } from 'react'
import { orderApi } from '../../api/orders'
import type { Order, OrderStatus } from '../../types'
import { StatusBadge } from '../../components/StatusBadge'
import { Pagination } from '../../components/Pagination'
import { getApiErrorMessage } from '../../api/client'

// Refleja exactamente OrderStatus.canTransitionTo() del backend (OrderStatus.java),
// para no ofrecer en el <select> una transición que el servidor va a rechazar con 409.
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: [],
  CANCELLED: [],
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState<string | null>(null)

  function load() {
    orderApi
      .getAll(page)
      .then((data) => {
        setOrders(data.content)
        setTotalPages(data.totalPages)
      })
      .catch((err) => setError(getApiErrorMessage(err)))
  }

  useEffect(load, [page])

  async function handleStatusChange(orderId: number, status: OrderStatus) {
    try {
      await orderApi.updateStatus(orderId, status)
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Todos los pedidos</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="space-y-3">
        {orders.map((order) => {
          const nextOptions = NEXT_STATUSES[order.status]
          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Pedido #{order.id}</span>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  {nextOptions.length > 0 && (
                    <select
                      onChange={(e) => e.target.value && handleStatusChange(order.id, e.target.value as OrderStatus)}
                      defaultValue=""
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="" disabled>
                        Cambiar estado…
                      </option>
                      {nextOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(order.createdAt).toLocaleString('es-ES')}
              </p>
              <p className="text-right font-bold">{order.totalAmount.toFixed(2)} €</p>
            </div>
          )
        })}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
