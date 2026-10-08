import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
      <Link to={`/products/${product.id}`} className="flex-1">
        <span className="text-xs uppercase tracking-wide text-brand-600 font-medium">
          {product.category.name}
        </span>
        <h3 className="font-semibold mt-1 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
      </Link>

      <div className="flex items-center justify-between mt-3">
        <span className="font-bold text-lg">{product.price.toFixed(2)} €</span>
        <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
        </span>
      </div>

      <button
        onClick={() => addItem(product)}
        disabled={product.stock === 0}
        className="mt-3 w-full bg-brand-600 text-white rounded py-2 text-sm font-medium hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Añadir al carrito
      </button>
    </div>
  )
}
