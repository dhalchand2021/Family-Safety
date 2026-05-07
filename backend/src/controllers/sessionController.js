const Device = require('../models/Device');

// @desc    Start a live session (audio/video)
// @route   POST /api/v1/sessions/start
// @access  Private (Parent)
exports.startSession = async (req, res, next) => {
  try {
    const { deviceId, type } = req.body;
    
    const device = await Device.findOne({ deviceId, userId: req.user.id });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    // In a real implementation, you might create a session record in the DB
    // and then emit a socket event to the child device.
    // For now, we'll return a success message.
    
    res.status(200).json({
      success: true,
      message: `Session ${type} requested for device ${deviceId}`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Stop a live session
// @route   POST /api/v1/sessions/stop
// @access  Private (Parent)
exports.stopSession = async (req, res, next) => {
  try {
    const { deviceId } = req.body;

    res.status(200).json({
      success: true,
      message: `Session stopped for device ${deviceId}`,
    });
  } catch (err) {
    next(err);
  }
};
