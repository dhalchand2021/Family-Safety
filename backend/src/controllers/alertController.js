const Alert = require('../models/Alert');

// @desc    Get all alerts for a user
// @route   GET /api/v1/alerts
// @access  Private (Parent)
exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark alert as read
// @route   PUT /api/v1/alerts/:id/read
// @access  Private (Parent)
exports.markAsRead = async (req, res, next) => {
  try {
    let alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    if (alert.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    alert.isRead = true;
    await alert.save();

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (err) {
    next(err);
  }
};
