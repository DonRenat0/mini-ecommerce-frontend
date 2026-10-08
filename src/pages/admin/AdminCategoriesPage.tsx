import { useEffect, useState, type FormEvent } from 'react'
import { categoryApi } from '../../api/categories'
import type { Category } from '../../types'
import { getApiErrorMessage } from '../../api/client'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function load() {
    categoryApi.getAll().then(setCategories)
  }

  useEffect(load, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await categoryApi.create({ name, description })
      setName('')
      setDescription('')
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Categorías</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6 space-y-3">
        <h2 className="font-medium text-sm">Nueva categoría</h2>
        <input
          required
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <input
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Creando…' : 'Crear categoría'}
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-lg divide-y">
        {categories.map((cat) => (
          <div key={cat.id} className="px-4 py-3">
            <p className="font-medium">{cat.name}</p>
            {cat.description && <p className="text-sm text-gray-500">{cat.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
