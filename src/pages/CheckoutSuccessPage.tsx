import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { orderApi } from '../api/orders'
import type { Order } from '../types'
import { StatusBadge } from '../components/StatusBadge'

export function CheckoutSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!id) return
    orderApi.getById(Number(id)).then(setOrder)
  }, [id])

  return (
    <div className="max-w-lg mx-auto text-center mt-8">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">¡Pedido confirmado!</h1>
      <p className="text-gray-500 mb-6">
        Tu pedido #{id} se ha creado correctamente y ya está descontado del stock.
      </p>

      {order && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-left mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Estado</span>
            <StatusBadge status={order.status} />
          </div>
          <ul className="space-y-1 text-sm text-gray-600 mb-3">
            {order.items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span>
                  {item.quantity} × {item.productName}
                </span>
                <span>{item.subtotal.toFixed(2)} €</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>{order.totalAmount.toFixed(2)} €</span>
          </div>
        </div>
      )}

      <Link to="/" className="text-brand-600 font-medium">
        Volver al catálogo
      </Link>
    </div>
  )
}
