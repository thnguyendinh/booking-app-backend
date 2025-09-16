# Booking App Backend

This is the backend API for the Booking App, built with **Node.js**, **Express**, and **MongoDB**. It provides RESTful endpoints for user authentication, room management, and booking management, with JWT-based authentication and role-based authorization (user/admin).

## Table of Contents
- [Setup](#setup)
- [Running the Backend Locally](#running-the-backend-locally)
- [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-collection)
- [Environment Variables](#environment-variables)
- [Testing with Newman](#testing-with-newman)
- [Notes for Frontend Team](#notes-for-frontend-team)

## Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/booking-app-backend.git
   cd booking-app-backend/Backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   - Create a `.env` file in the `Backend` directory with the following:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookingdb?retryWrites=true&w=majority
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```
   - Replace `<username>`, `<password>`, and `your_jwt_secret_key` with your MongoDB Atlas credentials and a secure JWT secret.

## Running the Backend Locally
1. **Seed the database** with initial data (users, rooms, bookings):
   ```bash
   node seed.js
   ```
2. **Start the server**:
   ```bash
   npm start
   ```
   - The server runs at `http://localhost:5000`.

## API Endpoints
All endpoints return JSON responses. Use the `x-auth-token` header for authenticated requests.

### Authentication
- **POST /api/auth/register**
  - Body: `{ "name": string, "email": string, "password": string, "isAdmin": boolean }`
  - Response: `{ "token": string }`
  - Example: Register a user or admin (set `isAdmin: true` for admin).
- **POST /api/auth/login**
  - Body: `{ "email": string, "password": string }`
  - Response: `{ "token": string }`
  - Example: Login to get JWT token.

### Rooms (Admin-only for POST, PUT, DELETE)
- **GET /api/rooms**
  - Response: Array of rooms `[ { "_id": string, "name": string, "description": string, "price": number, "capacity": number, "available": boolean } ]`
  - Example: Get all available rooms.
- **POST /api/rooms**
  - Headers: `{ "x-auth-token": string }`
  - Body: `{ "name": string, "description": string, "price": number, "capacity": number }`
  - Response: Created room object
  - Requires: Admin token
- **PUT /api/rooms/:id**
  - Headers: `{ "x-auth-token": string }`
  - Body: `{ "name": string, "description": string, "price": number, "capacity": number, "available": boolean }`
  - Response: Updated room object
  - Requires: Admin token
- **DELETE /api/rooms/:id**
  - Headers: `{ "x-auth-token": string }`
  - Response: `{ "msg": "Room deleted" }`
  - Requires: Admin token

### Bookings
- **POST /api/bookings**
  - Headers: `{ "x-auth-token": string }`
  - Body: `{ "roomId": string, "checkIn": string (ISO date), "checkOut": string (ISO date) }`
  - Response: Created booking object `{ "_id": string, "user": string, "room": string, "checkIn": string, "checkOut": string, "totalPrice": number, "status": string }`
  - Example: Create a booking for a room.
- **GET /api/bookings**
  - Headers: `{ "x-auth-token": string }`
  - Response: Array of bookings (admin sees all, user sees own bookings)
  - Example: Get booking history.
- **PUT /api/bookings/cancel/:id**
  - Headers: `{ "x-auth-token": string }`
  - Response: `{ "msg": "Booking cancelled" }`
  - Requires: User who owns the booking or admin.

## Postman Collection
- File: `Booking App APIs.postman_collection.json`
- Environment: `BookingAppEnv.postman_environment.json`
- Usage:
  1. Import both files into Postman.
  2. Set `baseUrl` to `http://localhost:5000` (or your deployed URL).
  3. Run the collection to test all endpoints (14 requests, 28 assertions).

## Environment Variables
The `.env` file is not included in the repository for security reasons. Team members must create their own `.env` file with:
```env
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

## Testing with Newman
1. Install Newman:
   ```bash
   npm install -g newman
   npm install -g newman-reporter-html
   ```
2. Run tests:
   ```bash
   newman run "Booking App APIs.postman_collection.json" -e "BookingAppEnv.postman_environment.json" --reporters cli,html --reporter-html-export report.html
   ```
3. Check `report.html` for results (expected: 28/28 assertions pass).

## Notes for Frontend Team
- **Base URL**: Use `http://localhost:5000` for local development or the deployed URL (e.g., Heroku, Render) for production.
- **Authentication**:
  - Store the `token` from `/api/auth/register` or `/api/auth/login` in local storage or cookies.
  - Include the token in the `x-auth-token` header for authenticated requests.
- **Error Handling**:
  - Handle common errors: `400` (bad request), `401` (unauthorized), `403` (forbidden), `404` (not found).
  - Example: `401` if token is missing or invalid, `403` if user tries to access admin-only endpoints.
- **Dynamic IDs**:
  - Use `_id` from responses of `GET /api/rooms` or `POST /api/bookings` for subsequent requests (e.g., `PUT /api/rooms/:id`, `PUT /api/bookings/cancel/:id`).
- **Testing**:
  - Run `node seed.js` to initialize the database with test data (2 users, 3 rooms, 2 bookings).
  - Use the Postman Collection to verify API behavior before integrating.
- **Deployment**:
  - If deploying to a platform like Heroku, ensure `MONGO_URI` and `JWT_SECRET` are set in the platform's environment variables.
  - Update `baseUrl` in the Postman environment file to match the deployed URL.

For issues or questions, contact the backend team via GitHub Issues or [your-email@example.com].