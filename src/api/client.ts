import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de REQUEST: en cada petición saliente, si hay un token guardado,
// lo añade automáticamente a la cabecera Authorization. Así el resto del código
// (páginas, componentes) nunca tiene que acordarse de añadir el token a mano.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de RESPONSE: si el backend devuelve 401 (token inválido/expirado),
// limpiamos la sesión local y mandamos al usuario de vuelta al login,
// en vez de dejar que cada pantalla tenga que gestionar ese caso por separado.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Helper para extraer un mensaje de error legible de cualquier respuesta de la API,
// sin repetir este try/catch de forma en cada página.
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; fields?: Record<string, string> } | undefined
    if (data?.fields) {
      return Object.values(data.fields).join(' — ')
    }
    if (data?.message) {
      return data.message
    }
    if (error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con el servidor. ¿Está el backend corriendo en el puerto 8080?'
    }
  }
  return 'Ha ocurrido un error inesperado'
}
