const express = require('express');
const { getAlerts, markAsRead } = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('parent'), getAlerts);
router.put('/:id/read', protect, authorize('parent'), markAsRead);

module.exports = router;
