const Device = require('../models/Device');
const crypto = require('crypto');

// @desc    Register a new device (pre-pairing)
// @route   POST /api/v1/devices/register
// @access  Private (Parent)
exports.registerDevice = async (req, res, next) => {
  try {
    const { deviceId, name } = req.body;
    
    // Generate a pairing token
    const pairingToken = crypto.randomBytes(4).toString('hex').toUpperCase();

    const device = await Device.create({
      userId: req.user.id,
      deviceId,
      name,
      pairingToken,
    });

    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Pair a device using token
// @route   POST /api/v1/devices/pair
// @access  Public (Child app)
exports.pairDevice = async (req, res, next) => {
  try {
    const { deviceId, pairingToken } = req.body;

    const device = await Device.findOne({ deviceId, pairingToken });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Invalid device ID or pairing token' });
    }

    device.isPaired = true;
    device.pairingToken = undefined; // Clear token after pairing
    await device.save();

    // Emit paired event to the device if it's connected
    const io = req.app.get('io');
    if (io) {
      io.to(deviceId).emit('paired', { success: true });
    }

    res.status(200).json({
      success: true,
      message: 'Device paired successfully',
      data: device,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all devices for a user
// @route   GET /api/v1/devices
// @access  Private (Parent)
exports.getDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (err) {
    next(err);
  }
};
