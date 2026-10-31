# ShopEase - E-Commerce Store

A full-stack e-commerce application built with React, Node.js, Express, MongoDB, and Docker.

## Features

- **Authentication** - Register/Login with JWT
- **Product Catalog** - Browse, search, filter, and sort products
- **Shopping Cart** - Add/remove items, update quantities
- **Checkout** - Shipping address and Stripe payment integration
- **Order Management** - View order history and tracking
- **Admin Panel** - Dashboard, product CRUD, order management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Payments | Stripe API |
| Containerization | Docker + Docker Compose |

## Quick Start

### With Docker (Recommended)

```bash
# Clone and enter the project
cd ecommerce-store

# Start all services
docker-compose up --build

# In a new terminal, seed the database
docker exec -it ecommerce-server npm run seed
```

### Without Docker

```bash
# Start MongoDB (make sure it's running)

# Backend
cd server
npm install
cp .env.example .env  # Configure your env vars
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

## Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| User | user@example.com | user123 |

## Project Structure

```
ecommerce-store/
├── client/          # React frontend (Vite + Tailwind)
├── server/          # Express backend API
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - List products (with search, filter, sort, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - My orders
- `GET /api/orders` - All orders (admin)
- `PUT /api/orders/:id/status` - Update status (admin)
