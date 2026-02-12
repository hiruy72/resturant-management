# 🍽️ Restaurant Management System

Full-stack restaurant management system with customer ordering and admin capabilities. Built with React, Pure Node.js, and PostgreSQL.

## ✨ Features

**Customer:** Registration/Login, Browse Menu, Shopping Cart, Place Orders, Order History, Table Reservations, Dark/Light Theme
**Admin:** Dashboard, Menu Management (CRUD), Order Management, Reservation Management, Email Notifications

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, React Router, Axios, Context API, Lucide Icons, CSS3
**Backend:** Pure Node.js (no Express), PostgreSQL (Neon), JWT, bcryptjs, Nodemailer, pg

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- PostgreSQL or Neon account
- npm/yarn

### Installation
```bash
git clone <repository-url>
cd Restaurant-website

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Configuration

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Setup Database
```bash
cd backend
node seed.js        # Create tables & seed menu
node seedAdmin.js   # Create admin user
```

**Default Admin:** admin@restaurant.com / adminpassword123

### Run Application
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm run dev
```

**Access:** Frontend: http://localhost:5173 | Backend: http://localhost:5000/api

## 📡 API Endpoints

### Authentication
```http
POST /api/auth/register    # Register user
POST /api/auth/login       # Login user
```

### Menu
```http
GET    /api/menu           # Get all menu items
POST   /api/menu           # Create item (Admin)
PUT    /api/menu/:id       # Update item (Admin)
DELETE /api/menu/:id       # Delete item (Admin)
```

### Orders
```http
POST /api/orders           # Place order
GET  /api/orders           # Get my orders
GET  /api/orders/all       # Get all orders (Admin)
PUT  /api/orders/:id       # Update status (Admin)
```

### Reservations
```http
POST /api/reservations     # Create reservation
GET  /api/reservations     # Get my reservations
GET  /api/reservations/all # Get all (Admin)
PUT  /api/reservations/:id # Update status (Admin)
```

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    delivery_address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Reservations
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INTEGER NOT NULL,
    special_requests TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📁 Project Structure

```
Restaurant-website/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── orderController.js
│   │   │   ├── menuController.js
│   │   │   └── reservationController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Order.js
│   │   │   ├── MenuItem.js
│   │   │   └── Reservation.js
│   │   ├── middleware/authMiddleware.js
│   │   └── utils/sendEmail.js
│   ├── server.js
│   └── seed.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/api.js
    │   └── App.jsx
    └── vite.config.js
```

## 🔒 Security

- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention (parameterized queries)
- CORS configuration
- Role-based access control
- SSL database connection

## 🎯 Key Flows

**Authentication:** Register → JWT Token → localStorage → API Requests → Token Validation
**Ordering:** Browse Menu → Add to Cart → Checkout → Database → Email Notification
**Admin Menu:** Login → Admin Panel → CRUD Operations → Real-time Updates

## 📝 Development

```bash
# Run tests
npm test

# Build for production
npm run build
```

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] Database created
- [ ] `.env` configured
- [ ] Tables created (`node seed.js`)
- [ ] Admin created (`node seedAdmin.js`)
- [ ] Backend running
- [ ] Frontend running

## 📄 License

MIT License

---

**⚠️ Important:** Change default passwords and JWT secrets before production deployment!
