const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

router.post('/', authMiddleware, async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    if (!room.available) return res.status(400).json({ msg: 'Room not available' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ msg: 'Check-out must be after check-in' });
    }

    const existingBookings = await Booking.find({
      room: roomId,
      $or: [
        { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkInDate } }
      ]
    });
    if (existingBookings.length > 0) {
      return res.status(400).json({ msg: 'Room is already booked for the selected dates' });
    }

    const days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const totalPrice = days * room.price;

    const booking = new Booking({
      user: req.user.id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      status: 'confirmed'
    });

    await booking.save();
    await Room.findByIdAndUpdate(roomId, { available: false });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    let bookings;
    if (req.user.isAdmin) {
      bookings = await Booking.find().populate('user', 'name email').populate('room', 'name price');
    } else {
      bookings = await Booking.find({ user: req.user.id }).populate('room', 'name price');
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/cancel/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to cancel this booking' });
    }
    booking.status = 'cancelled';
    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { available: true });
    res.json({ msg: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to delete this booking' });
    }
    await Booking.findByIdAndDelete(req.params.id);
    await Room.findByIdAndUpdate(booking.room, { available: true });
    res.json({ msg: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;