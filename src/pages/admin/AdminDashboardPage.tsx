import { Link } from 'react-router-dom'

const SECTIONS = [
  { to: '/admin/products', title: 'Productos', desc: 'Crear, editar y eliminar productos del catálogo' },
  { to: '/admin/categories', title: 'Categorías', desc: 'Ver y crear categorías' },
  { to: '/admin/orders', title: 'Pedidos', desc: 'Ver todos los pedidos y cambiar su estado' },
]

export function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel de administración</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SECTIONS.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-brand-500 transition-colors"
          >
            <h2 className="font-semibold mb-1">{section.title}</h2>
            <p className="text-sm text-gray-500">{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
