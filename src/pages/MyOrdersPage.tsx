import { useEffect, useState } from 'react'
import { orderApi } from '../api/orders'
import type { Order } from '../types'
import { StatusBadge } from '../components/StatusBadge'
import { Pagination } from '../components/Pagination'
import { getApiErrorMessage } from '../api/client'

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    orderApi
      .getMyOrders(page)
      .then((data) => {
        setOrders(data.content)
        setTotalPages(data.totalPages)
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading && <p className="text-gray-500 text-sm">Cargando…</p>}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500 text-sm">Todavía no has hecho ningún pedido.</p>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Pedido #{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(order.createdAt).toLocaleString('es-ES')}
            </p>
            <ul className="text-sm text-gray-600 space-y-0.5">
              {order.items.map((item) => (
                <li key={item.productId}>
                  {item.quantity} × {item.productName}
                </li>
              ))}
            </ul>
            <p className="text-right font-bold mt-2">{order.totalAmount.toFixed(2)} €</p>
          </div>
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
