const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
require('dotenv').config();

const seed = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});

    // Tạo users
    const salt = await bcrypt.genSalt(10);
    const users = [
      {
        name: 'Nguyen Van A',
        email: 'nguyenvana@example.com',
        password: await bcrypt.hash('password123', salt),
        isAdmin: false,
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', salt),
        isAdmin: true,
      },
    ];
    const createdUsers = await User.insertMany(users);

    // Tạo rooms
    const rooms = [
      { name: 'Phòng Deluxe', description: 'Phòng sang trọng', price: 100, capacity: 2, available: true },
      { name: 'Phòng Standard', description: 'Phòng tiêu chuẩn', price: 50, capacity: 2, available: true },
      { name: 'Phòng Family', description: 'Phòng gia đình', price: 150, capacity: 4, available: true },
    ];
    const createdRooms = await Room.insertMany(rooms);

    // Tạo bookings
    const bookings = [
      {
        user: createdUsers[0]._id,
        room: createdRooms[0]._id,
        checkIn: new Date('2025-10-01'),
        checkOut: new Date('2025-10-03'),
        totalPrice: 200,
      },
      {
        user: createdUsers[0]._id,
        room: createdRooms[1]._id,
        checkIn: new Date('2025-10-05'),
        checkOut: new Date('2025-10-07'),
        totalPrice: 100,
      },
    ];
    await Booking.insertMany(bookings);

    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seed();