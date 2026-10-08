import { createContext, useContext, useState, type ReactNode } from 'react'
import { authApi } from '../api/auth'
import type { LoginRequest, RegisterRequest, Role } from '../types'

interface AuthUser {
  email: string
  fullName: string
  role: Role
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser)

  function persistSession(response: { token: string; email: string; fullName: string; role: Role }) {
    localStorage.setItem('token', response.token)
    const authUser: AuthUser = { email: response.email, fullName: response.fullName, role: response.role }
    localStorage.setItem('user', JSON.stringify(authUser))
    setUser(authUser)
  }

  async function login(data: LoginRequest) {
    const response = await authApi.login(data)
    persistSession(response)
  }

  async function register(data: RegisterRequest) {
    const response = await authApi.register(data)
    persistSession(response)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  }
  return context
}
