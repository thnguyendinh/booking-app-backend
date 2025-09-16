# Booking App Backend

This is the backend API for the Booking App, built with **Node.js**, **Express**, and **MongoDB**. It provides RESTful endpoints for user authentication, room management, and booking management, with JWT-based authentication and role-based authorization (user/admin).

## Table of Contents
- [Overview](#overview)
- [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
- [Features](#features)
- [Setup](#setup)
- [Running the Backend Locally](#running-the-backend-locally)
- [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-collection)
- [Environment Variables](#environment-variables)
- [Testing with Newman](#testing-with-newman)
- [Notes for Frontend Team](#notes-for-frontend-team)

## Overview
The Booking App Backend is a RESTful API that supports a booking application (e.g., hotel, homestay). It manages users, rooms, and bookings, with role-based access (users and admins). The API has been tested with Postman/Newman, achieving **28/28 assertions passed** with no failures.

## Entity-Relationship Diagram (ERD)
The database `bookingdb` consists of three collections: `users`, `rooms`, and `bookings`. Below is the text-based ERD:

```
[Users]
- _id: ObjectId (Primary Key)
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- isAdmin: Boolean (default: false)

[Rooms]
- _id: ObjectId (Primary Key)
- name: String (required)
- description: String (required)
- price: Number (required)
- capacity: Number (required)
- available: Boolean (default: true)

[Bookings]
- _id: ObjectId (Primary Key)
- user: ObjectId (References Users._id, required)
- room: ObjectId (References Rooms._id, required)
- checkIn: Date (required)
- checkOut: Date (required)
- totalPrice: Number (required)
- status: String (enum: ["confirmed", "cancelled"], default: "confirmed")

Relationships:
- Bookings.user (1-to-Many): One User can have many Bookings.
- Bookings.room (1-to-Many): One Room can be booked in many Bookings.
```

Visualize this ERD using tools like MongoDB Compass, dbdiagram.io, or Lucidchart.

## Features
1. **User Management**:
   - Register (`POST /api/auth/register`): Create user or admin accounts.
   - Login (`POST /api/auth/login`): Authenticate and get JWT token.
   - Frontend: Build login/register forms, store token in local storage/cookies.

2. **Room Management** (Admin-only for create/update/delete):
   - Get available rooms (`GET /api/rooms`): List rooms with `available: true`.
   - Create room (`POST /api/rooms`): Add new room.
   - Update room (`PUT /api/rooms/:id`): Modify room details.
   - Delete room (`DELETE /api/rooms/:id`): Remove a room.
   - Frontend: Display room list, admin dashboard for managing rooms.

3. **Booking Management**:
   - Create booking (`POST /api/bookings`): Book a room with check-in/check-out dates.
   - Get bookings (`GET /api/bookings`): View user’s bookings (user) or all bookings (admin).
   - Cancel booking (`PUT /api/bookings/cancel/:id`): Cancel a booking (owner or admin).
   - Frontend: Booking form, booking history page, cancel button.

4. **Role-Based Authorization**:
   - Users: Can book rooms, view/cancel their own bookings.
   - Admins: Can manage rooms and cancel any booking.
   - Frontend: Show/hide admin features based on `isAdmin` in token.

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
   - Create a `.env` file in the `Backend` directory:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookingdb?retryWrites=true&w=majority
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```
   - Replace `<username>`, `<password>`, and `your_jwt_secret_key` with your MongoDB Atlas credentials and a secure JWT secret.

## Running the Backend Locally
1. **Seed the database** with initial data:
   ```bash
   node seed.js
   ```
   - Creates 2 users (`nguyenvana@example.com`, `admin@example.com`), 3 rooms, and 2 bookings.
2. **Start the server**:
   ```bash
   npm start
   ```
   - Server runs at `http://localhost:5000`.

## API Endpoints
All endpoints return JSON. Use the `x-auth-token` header for authenticated requests.

### Authentication
- **POST /api/auth/register**
  - Body: `{ "name": string, "email": string, "password": string, "isAdmin": boolean }`
  - Response: `{ "token": string }`
- **POST /api/auth/login**
  - Body: `{ "email": string, "password": string }`
  - Response: `{ "token": string }`

### Rooms (Admin-only for POST, PUT, DELETE)
- **GET /api/rooms**
  - Response: `[ { "_id": string, "name": string, "description": string, "price": number, "capacity": number, "available": boolean } ]`
- **POST /api/rooms**
  - Headers: `{ "x-auth-token": string }`
  - Body: `{ "name": string, "description": string, "price": number, "capacity": number }`
  - Response: Created room object
- **PUT /api/rooms/:id**
  - Headers: `{ "x-auth-token": string }`
  - Body: `{ "name": string, "description": string, "price": number, "capacity": number, "available": boolean }`
  - Response: Updated room object
- **DELETE /api/rooms/:id**
  - Headers: `{ "x-auth-token": string }`
  - Response: `{ "msg": "Room deleted" }`

### Bookings
- **POST /api/bookings**
  - Headers: `{ "x-auth-token": string }`
  - Body: `{ "roomId": string, "checkIn": string (ISO date), "checkOut": string (ISO date) }`
  - Response: `{ "_id": string, "user": string, "room": string, "checkIn": string, "checkOut": string, "totalPrice": number, "status": string }`
- **GET /api/bookings**
  - Headers: `{ "x-auth-token": string }`
  - Response: Array of bookings (admin sees all, user sees own)
- **PUT /api/bookings/cancel/:id**
  - Headers: `{ "x-auth-token": string }`
  - Response: `{ "msg": "Booking cancelled" }`

## Postman Collection
- Files: `Booking App APIs.postman_collection.json`, `BookingAppEnv.postman_environment.json`
- Usage:
  1. Import both files into Postman.
  2. Set `baseUrl` to `http://localhost:5000` (or deployed URL).
  3. Run the collection to test 14 requests (28 assertions).

## Environment Variables
Create a `.env` file with:
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
3. Check `report.html`: Expected **28/28 assertions passed**.

## Notes for Frontend Team
- **Base URL**: Use `http://localhost:5000` for local development or the deployed URL (e.g., Heroku).
- **Authentication**:
  - Store `token` from `/api/auth/register` or `/api/auth/login` in local storage/cookies.
  - Include `x-auth-token` header in authenticated requests.
- **UI Integration**:
  - **Homepage**: Call `GET /api/rooms` to display available rooms (e.g., room cards with name, price, description).
  - **Booking Page**: Use `POST /api/bookings` for booking form, show `totalPrice` in confirmation.
  - **User Profile**: Call `GET /api/bookings` to show booking history, add cancel button (`PUT /api/bookings/cancel/:id`).
  - **Admin Dashboard**: Use `POST/PUT/DELETE /api/rooms` for room management, `GET /api/bookings` for all bookings.
- **Error Handling**:
  - Handle errors: `400` (invalid data), `401` (invalid/missing token), `403` (no permission), `404` (not found).
  - Example: Show toast message for `403` when user tries admin actions.
- **Dynamic IDs**:
  - Use `_id` from `GET /api/rooms` or `POST /api/bookings` for subsequent requests.
- **Testing**:
  - Run `node seed.js` to initialize test data.
  - Use Postman Collection to verify API behavior.
- **Deployment**:
  - For production, deploy to Heroku/Render and update `baseUrl`.
  - Set `MONGO_URI` and `JWT_SECRET` in platform environment variables.

For support, create a GitHub Issue or contact [your-email@example.com].