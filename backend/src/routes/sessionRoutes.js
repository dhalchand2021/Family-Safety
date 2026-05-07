const express = require('express');
const { startSession, stopSession } = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/start', protect, authorize('parent'), startSession);
router.post('/stop', protect, authorize('parent'), stopSession);

module.exports = router;
