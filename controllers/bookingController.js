const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.createBooking = async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room || !room.available) {
      return res.status(400).json({ msg: 'Room not available' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const totalPrice = days * room.price;

    const booking = new Booking({
      user: req.user.id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
    });

    await booking.save();
    room.available = false;
    await room.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = req.user.isAdmin
      ? await Booking.find().populate('user').populate('room')
      : await Booking.find({ user: req.user.id }).populate('room');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const room = await Room.findById(booking.room);
    room.available = true;
    await room.save();

    res.json({ msg: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};