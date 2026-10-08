import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productApi } from '../../api/products'
import type { Product } from '../../types'
import { getApiErrorMessage } from '../../api/client'
import { Pagination } from '../../components/Pagination'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState<string | null>(null)

  function load() {
    productApi
      .getAll({ page, size: 10 })
      .then((data) => {
        setProducts(data.content)
        setTotalPages(data.totalPages)
      })
      .catch((err) => setError(getApiErrorMessage(err)))
  }

  useEffect(load, [page])

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    try {
      await productApi.delete(id)
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          to="/admin/products/new"
          className="bg-brand-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-brand-700"
        >
          + Nuevo producto
        </Link>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2 text-gray-500">{product.category.name}</td>
                <td className="px-4 py-2">{product.price.toFixed(2)} €</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2 text-right space-x-3">
                  <Link to={`/admin/products/${product.id}/edit`} className="text-brand-600">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
