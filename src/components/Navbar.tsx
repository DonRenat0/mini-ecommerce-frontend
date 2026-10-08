import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-brand-600">
          Mini Shop
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-brand-600">
            Catálogo
          </Link>

          {isAuthenticated && (
            <Link to="/my-orders" className="hover:text-brand-600">
              Mis pedidos
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="hover:text-brand-600 font-medium">
              Panel admin
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-brand-600">
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-500">Hola, {user?.fullName.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 border border-gray-300 rounded px-3 py-1.5"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-brand-600 text-white rounded px-3 py-1.5 hover:bg-brand-700"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
