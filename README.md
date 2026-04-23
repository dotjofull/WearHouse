# WearHouse

WearHouse is a full-stack clothing e-commerce platform built with Node.js, Express, MongoDB, and React. The application allows users to browse clothing products, search and filter items, add products to the cart, place orders, and track their order history. It also includes an admin dashboard for managing products, categories, and orders.

## Features

- User registration and login
- JWT authentication and role-based authorization
- Protected routes for users and admins
- Browse products with search, category filtering, and pagination
- Product details page with quantity selection
- Cart management using localStorage
- Place orders and view order history
- Admin dashboard to manage:
  - Products
  - Categories
  - Orders and order status
- Responsive UI built with Bootstrap

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Frontend
- React
- React Router DOM
- Axios
- Bootstrap
- Vite

## Project Structure

```bash
backend/
frontend/
README.md
```

## Database Models

### User
- name
- email
- password
- role

### Category
- title
- description
- imageUrl
- createdBy

### Product
- name
- description
- price
- category
- stock
- imageUrl
- createdBy

### Order
- user
- items
- totalPrice
- status

## Main Pages

- Home
- Product Detail
- Login
- Register
- Cart
- My Orders
- Admin Dashboard

## User Roles

### User
- Register and login
- View all products
- Search and filter products
- Add products to cart
- Place orders
- View personal orders

### Admin
- Add products
- Edit products
- Delete products
- Add categories
- Edit categories
- Delete categories
- View all orders
- Update order status

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile`
- PUT `/api/auth/profile`

### Categories
- GET `/api/category`
- POST `/api/category`
- PUT `/api/category/:id`
- DELETE `/api/category/:id`

### Products
- GET `/api/products`
- GET `/api/products/:id`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

### Orders
- POST `/api/orders`
- GET `/api/orders/my`
- GET `/api/orders/:id`
- GET `/api/orders`
- PUT `/api/orders/:id/status`

## Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside the `backend` folder and add:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

## Frontend Setup

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### backend/.env
```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

### backend/.env.example
```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

## How to Use

1. Register a new account or log in with an existing account
2. Browse products from the home page
3. Use the search bar and category filter to find products
4. Open a product details page and add items to the cart
5. Place an order from the cart page
6. View order history in the My Orders page
7. Log in as an admin to access the Admin Dashboard

## Admin Access

Admin users use the same login page as normal users. A user becomes an admin when their role in the database is changed from `user` to `admin`.

## Notes

- `.env` should not be pushed to GitHub
- Use `.env.example` instead
- `node_modules` should be ignored
- All API endpoints should be tested in Postman before final submission

## Future Improvements

- Google Sign In
- Mail service
- Message verification
- Geolocation
- Online payment
- Real-time notifications
- Cloudinary integration

## Author

WearHouse Project
                