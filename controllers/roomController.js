const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  const { name, description, price, capacity } = req.body;

  try {
    const room = new Room({ name, description, price, capacity });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ available: true });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateRoom = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  const { name, description, price, capacity, available } = req.body;

  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    room.name = name || room.name;
    room.description = description || room.description;
    room.price = price || room.price;
    room.capacity = capacity || room.capacity;
    room.available = available !== undefined ? available : room.available;

    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteRoom = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    await room.remove();
    res.json({ msg: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};