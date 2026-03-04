const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  area: {
    province: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    sector: {
      type: String
    }
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['planned', 'emergency', 'maintenance', 'restoration', 'announcement'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'cancelled'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  affectedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  smsSent: {
    type: Boolean,
    default: false
  },
  emailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for querying notifications by area
notificationSchema.index({ 'area.province': 1, 'area.district': 1 });
notificationSchema.index({ status: 1, startTime: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
