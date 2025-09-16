# Entity-Relationship Diagram (ERD) for Booking App Backend

The database `bookingdb` consists of three main collections: `users`, `rooms`, and `bookings`. Below is the ERD in text-based format, showing the fields and relationships between collections.

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

**Explanation**:
- **Users**: Stores user information (name, email, password, admin status).
- **Rooms**: Stores room details (name, description, price, capacity, availability).
- **Bookings**: Links a user to a room for a specific period, with calculated total price and status.
- **Relationships**:
  - A `User` can create multiple `Bookings` (1-to-Many).
  - A `Room` can be referenced in multiple `Bookings` (1-to-Many).
  - The `Bookings` collection uses `ObjectId` references (`user`, `room`) to connect to `Users` and `Rooms`.

This ERD can be visualized using tools like MongoDB Compass, dbdiagram.io, or Lucidchart by importing the above schema.