# Goodreads Clone

A scalable Goodreads-like web application for book discovery, rating, reviewing, tracking reading status, social connections, book clubs, and personalized recommendations.

## Features
- User registration and login (JWT authentication)
- Book catalog with search and pagination
- Add books to personal bookshelf with status: Want to Read, Currently Reading, Read
- View and manage your bookshelf
- Update reading status or remove books from shelf
- Social features (book clubs, friends) - planned
- Personalized recommendations - planned

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend:** React, Next.js (App Router), TypeScript

---

## Monorepo Structure
```
goodreads-clone/
├── backend/      # Express API server
├── frontend/     # Next.js React app
```

---

## Backend Setup

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your MongoDB URI and JWT secret.
3. **Start the server:**
   ```sh
   npm run dev
   ```
   The backend runs on [http://localhost:5000](http://localhost:5000)

### API Endpoints
- `POST   /api/users/register` — Register a new user
- `POST   /api/users/login` — Login and get JWT
- `GET    /api/books` — List books (with pagination)
- `POST   /api/books` — Add a new book
- `GET    /api/users/bookshelf` — Get current user's bookshelf
- `POST   /api/users/bookshelf` — Add a book to shelf
- `PUT    /api/users/bookshelf/:id` — Update bookshelf item
- `DELETE /api/users/bookshelf/:id` — Remove book from shelf

---

## Frontend Setup

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```
2. **Configure environment:**
   - Set the backend API URL in `.env.local` if needed (default: `http://localhost:5000/api`)
3. **Start the frontend:**
   ```sh
   npm run dev
   ```
   The frontend runs on [http://localhost:3000](http://localhost:3000)

---

## Usage
- Register or log in
- Browse the book catalog
- Add books to your shelf and update their status
- View and manage your bookshelf

---

## Development
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`


