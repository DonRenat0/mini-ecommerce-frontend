import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Estas dos rutas son el equivalente, en el frontend, a lo que
 * SecurityConfig.java hace en el backend: deciden qué páginas
 * requieren estar autenticado y cuáles requieren rol ADMIN.
 *
 * IMPORTANTE: esto es solo una comodidad de UX (ocultar botones/páginas
 * que el usuario no debería ni intentar usar). La seguridad REAL sigue
 * viviendo en el backend — un usuario que manipule el frontend a mano
 * seguirá recibiendo 401/403 del servidor, que es la única barrera
 * que de verdad importa.
 */

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function AdminRoute() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
