import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productApi } from '../api/products'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'
import { getApiErrorMessage } from '../api/client'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    productApi
      .getById(Number(id))
      .then(setProduct)
      .catch((err) => setError(getApiErrorMessage(err)))
  }, [id])

  if (error) return <p className="text-red-600 text-sm">{error}</p>
  if (!product) return <p className="text-gray-500 text-sm">Cargando…</p>

  return (
    <div className="max-w-2xl">
      <Link to="/" className="text-sm text-brand-600 mb-4 inline-block">
        ← Volver al catálogo
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <span className="text-xs uppercase tracking-wide text-brand-600 font-medium">
          {product.category.name}
        </span>
        <h1 className="text-2xl font-bold mt-1 mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <div className="flex items-center justify-between mb-6">
          <span className="text-3xl font-bold">{product.price.toFixed(2)} €</span>
          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
          </span>
        </div>

        {product.stock > 0 && (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.stock)))}
              className="w-20 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                addItem(product, quantity)
                setAdded(true)
                setTimeout(() => setAdded(false), 1500)
              }}
              className="flex-1 bg-brand-600 text-white rounded py-2 text-sm font-medium hover:bg-brand-700"
            >
              {added ? '✓ Añadido' : 'Añadir al carrito'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
