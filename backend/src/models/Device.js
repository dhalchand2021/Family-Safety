const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceId: {
    type: String,
    required: [true, 'Please add a device ID'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a device name'],
  },
  pairingToken: {
    type: String,
  },
  isPaired: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  batteryLevel: {
    type: Number,
  },
  networkType: {
    type: String,
  },
});

module.exports = mongoose.model('Device', DeviceSchema);
