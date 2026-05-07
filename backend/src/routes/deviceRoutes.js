const express = require('express');
const { registerDevice, pairDevice, getDevices } = require('../controllers/deviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', protect, authorize('parent'), registerDevice);
router.post('/pair', pairDevice);
router.get('/', protect, authorize('parent'), getDevices);

module.exports = router;
