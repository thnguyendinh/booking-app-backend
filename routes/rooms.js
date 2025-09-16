const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, roomController.createRoom);
router.get('/', roomController.getRooms);
router.put('/:id', authMiddleware, roomController.updateRoom);
router.delete('/:id', authMiddleware, roomController.deleteRoom);

module.exports = router;