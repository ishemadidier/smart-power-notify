const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['outage', 'low_voltage', 'damaged_line', 'billing', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  adminResponse: {
    type: String
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
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
    },
    address: {
      type: String
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  }
}, {
  timestamps: true
});

// Index for querying reports
reportSchema.index({ userId: 1, status: 1 });
reportSchema.index({ 'location.district': 1, status: 1 });

module.exports = mongoose.model('Report', reportSchema);
