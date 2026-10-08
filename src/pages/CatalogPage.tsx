import { useEffect, useState } from 'react'
import { productApi } from '../api/products'
import { categoryApi } from '../api/categories'
import type { Category, Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { Pagination } from '../components/Pagination'
import { getApiErrorMessage } from '../api/client'

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(() => {
      /* si falla el listado de categorías, el catálogo sigue funcionando sin filtro */
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    productApi
      .getAll({ categoryId: selectedCategory, page })
      .then((data) => {
        setProducts(data.content)
        setTotalPages(data.totalPages)
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [selectedCategory, page])

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Catálogo</h1>

        <select
          value={selectedCategory ?? ''}
          onChange={(e) => {
            setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)
            setPage(0)
          }}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500 text-sm">Cargando productos…</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
