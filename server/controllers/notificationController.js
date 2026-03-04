const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendNotificationSMS } = require('../services/smsService');

// Get all notifications (with filters)
exports.getNotifications = async (req, res) => {
  try {
    const { province, district, status, type, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (province) query['area.province'] = province;
    if (district) query['area.district'] = district;
    if (status) query.status = status;
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to get notifications', error: error.message });
  }
};

// Get notifications for a specific user (based on their area)
exports.getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Show all active notifications for demo purposes
    // Users can see all REG announcements
    const notifications = await Notification.find({ status: 'active' })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ notifications });
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({ message: 'Failed to get notifications', error: error.message });
  }
};

// Create new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, area, startTime, endTime, type, sendSMS } = req.body;

    // Find affected users
    let affectedUsers = [];
    if (area.district) {
      affectedUsers = await User.find({
        $or: [
          { province: area.province },
          { district: area.district },
          { province: 'All' }
        ]
      }).select('_id');
    }

    const notification = new Notification({
      title,
      message,
      area,
      startTime,
      endTime,
      type,
      createdBy: req.user.id,
      affectedUsers: affectedUsers.map(u => u._id),
      smsSent: sendSMS ? false : false
    });

    await notification.save();

    // Emit real-time notification via Socket.io
    const io = req.app.get('io');
    io.emit('new-notification', {
      notification: await notification.populate('createdBy', 'name')
    });

    // Send SMS to affected users
    if (sendSMS && affectedUsers.length > 0) {
      // Get full user objects for SMS
      const usersForSMS = await User.find({
        _id: { $in: affectedUsers }
      }).select('phone name');
      
      // Send SMS to all affected users
      await sendNotificationSMS(usersForSMS, notification);
      
      notification.smsSent = true;
      await notification.save();
    }

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
};

// Update notification
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, area, startTime, endTime, type, status } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { title, message, area, startTime, endTime, type, status },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Emit update via Socket.io
    const io = req.app.get('io');
    io.emit('notification-updated', { notification });

    res.json({ message: 'Notification updated', notification });
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Emit delete via Socket.io
    const io = req.app.get('io');
    io.emit('notification-deleted', { id });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
};

// Get notification stats (admin)
exports.getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const activeNotifications = await Notification.countDocuments({ status: 'active' });
    const resolvedNotifications = await Notification.countDocuments({ status: 'resolved' });

    const notificationsByType = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const notificationsByDistrict = await Notification.aggregate([
      { $group: { _id: '$area.district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalNotifications,
      activeNotifications,
      resolvedNotifications,
      notificationsByType,
      notificationsByDistrict
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};
