import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { orderApi } from '../api/orders'
import { getApiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function CartPage() {
  const { items, updateQuantity, removeItem, clear, totalPrice } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }

    setError(null)
    setLoading(true)
    try {
      const order = await orderApi.create({
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      })
      clear()
      navigate(`/orders/${order.id}/success`)
    } catch (err) {
      // Aquí es donde puede llegar, por ejemplo, un 409 por stock insuficiente
      // (InsufficientStockException) o por un choque de optimistic locking en el backend.
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return <p className="text-gray-500 text-sm">Tu carrito está vacío.</p>
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Tu carrito</h1>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">{item.product.price.toFixed(2)} € / unidad</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={item.product.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <span className="font-medium w-20 text-right">
                {(item.product.price * item.quantity).toFixed(2)} €
              </span>
              <button
                onClick={() => removeItem(item.product.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between mb-4">
        <span className="font-medium">Total</span>
        <span className="text-xl font-bold">{totalPrice.toFixed(2)} €</span>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-brand-600 text-white rounded py-3 font-medium hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? 'Procesando…' : isAuthenticated ? 'Confirmar pedido' : 'Inicia sesión para pagar'}
      </button>
    </div>
  )
}
