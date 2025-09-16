const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Thêm endpoint xóa user (chỉ admin)
router.delete('/delete', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  try {
    await User.deleteMany({ email: 'admin_test2@example.com' });
    res.json({ msg: 'Users deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;