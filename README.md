# Mini E-commerce — Frontend

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

Interfaz web (React + TypeScript + Tailwind) que consume la [API del mini-ecommerce en Spring Boot](../mini-ecommerce). Incluye catálogo, carrito, checkout, historial de pedidos y un panel de administración completo.

---

## 🚀 Quick start

**Requisito previo**: el backend debe estar corriendo en `http://localhost:8080` (ver el README del proyecto `mini-ecommerce`, `docker compose up`).

```bash
npm install
npm run dev
```

Abre **http://localhost:5173**.

### Usuarios de prueba (los mismos del backend)

| Rol | Email | Contraseña |
|---|---|---|
| ADMIN | `admin@shop.com` | `admin123` |
| CUSTOMER | `customer@shop.com` | `customer123` |

---

## 🧱 Stack técnico

| Categoría | Tecnología |
|---|---|
| Librería UI | React 18 |
| Lenguaje | TypeScript |
| Bundler / dev server | Vite |
| Estilos | Tailwind CSS |
| Peticiones HTTP | Axios |
| Enrutado | React Router 6 |
| Estado global | React Context (`AuthContext`, `CartContext`) |

No se usa Redux ni ninguna librería de estado externa a propósito: para el tamaño de esta app, dos Context bien delimitados son más que suficientes y más fáciles de razonar.

---

## 🗂️ Estructura

```
src/
├── api/            # Un archivo por recurso del backend (auth, products, categories, orders)
│   └── client.ts   # Instancia de Axios + interceptores (JWT automático, manejo de 401)
├── context/        # Estado global: sesión (AuthContext) y carrito (CartContext)
├── components/     # Piezas reutilizables (Navbar, ProductCard, Pagination, rutas protegidas...)
├── pages/          # Una página por ruta
│   └── admin/      # Panel de administración
├── types/          # Tipos TypeScript, espejo exacto de los DTOs del backend
└── App.tsx         # Definición de todas las rutas
```

---

## 🔐 Cómo funciona la autenticación aquí

1. Al hacer login (`AuthContext.login`), el backend devuelve un JWT.
2. Se guarda en `localStorage` (`token` y `user`).
3. El interceptor de `api/client.ts` añade automáticamente `Authorization: Bearer <token>` a **todas** las peticiones salientes — ninguna página tiene que acordarse de hacerlo a mano.
4. Si el backend responde `401` (token expirado o inválido), el interceptor limpia la sesión y redirige a `/login` automáticamente.

**Importante:** `ProtectedRoute` y `AdminRoute` (en `components/ProtectedRoute.tsx`) son solo una comodidad de interfaz — ocultan botones y páginas a las que el usuario no debería llegar. La seguridad *de verdad* sigue estando en el backend (`SecurityConfig.java`): si alguien manipula el frontend a mano para saltarse estas rutas, el servidor seguirá devolviendo `401`/`403` igualmente.

---

## 🛒 Cómo funciona el carrito

Vive enteramente en el navegador (`CartContext` + `localStorage`) hasta que el usuario pulsa "Confirmar pedido". En ese momento se manda como un único `POST /api/orders` con la lista de `{ productId, quantity }` — el backend es quien valida stock, calcula el total y congela los precios, no el frontend. Si el backend responde con un error (por ejemplo, `409` por stock insuficiente), se muestra tal cual llega en el checkout.

---

## ⚙️ Variables de entorno

Copia `.env.example` a `.env` si necesitas apuntar a un backend en otra URL (por ejemplo, si cambiaste el puerto en `docker-compose.yml`). Con el valor por defecto ya funciona sin tocar nada.

---

## 📜 Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload en `localhost:5173` |
| `npm run build` | Compila TypeScript y genera el build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente, para probarlo antes de desplegar |
| `npm run lint` | Corre ESLint sobre todo el proyecto |

---

## 🗺️ Posibles próximos pasos

- Tests con React Testing Library / Vitest para componentes y páginas críticas
- Manejo de "producto sin stock justo al confirmar" con un mensaje más específico (ahora mismo se ve como error genérico del backend)
- Skeleton loaders en vez de "Cargando…" en texto plano
- Imágenes reales de producto (ahora mismo no hay campo de imagen ni en backend ni aquí)
