// Estos tipos son el espejo, en TypeScript, de los "records" DTO del backend
// (ver /src/main/java/com/example/ecommerce/dto en el proyecto Java).
// Si cambias un campo en el backend, este es el primer archivo que hay que tocar aquí.

export type Role = 'CUSTOMER' | 'ADMIN'

export interface AuthResponse {
  token: string
  email: string
  fullName: string
  role: Role
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface Category {
  id: number
  name: string
  description: string | null
}

export interface CategoryRequest {
  name: string
  description?: string
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  category: Category
}

export interface ProductRequest {
  name: string
  description?: string
  price: number
  stock: number
  categoryId: number
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED'

export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: number
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
}

export interface OrderItemRequest {
  productId: number
  quantity: number
}

export interface OrderRequest {
  items: OrderItemRequest[]
}

// Spring envuelve las respuestas paginadas en esta forma (Page<T> de Spring Data).
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number // página actual (0-indexada, igual que en el backend)
  size: number
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message?: string
  fields?: Record<string, string>
}

// Tipo local del carrito: no existe como tal en el backend,
// vive solo en el navegador hasta que se confirma el pedido.
export interface CartItem {
  product: Product
  quantity: number
}
