const Report = require('../models/Report');
const User = require('../models/User');

// Get all reports (admin)
exports.getReports = async (req, res) => {
  try {
    const { status, district, type, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (district) query['location.district'] = district;

    const reports = await Report.find(query)
      .populate('userId', 'name phone meterNumber')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Failed to get reports', error: error.message });
  }
};

// Get reports for current user
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({ message: 'Failed to get reports', error: error.message });
  }
};

// Create new report
exports.createReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

const { type, description, image, location: reportLocation } = req.body;

    const report = new Report({
      userId: req.user.id,
      type,
      description,
      image,
      location: {
        province: reportLocation?.province || user.province,
        district: reportLocation?.district || user.district,
        sector: reportLocation?.sector || user.sector,
        address: reportLocation?.address,
        lat: reportLocation?.lat,
        lng: reportLocation?.lng
      }
    });

    await report.save();
    await report.populate('userId', 'name phone');

    res.status(201).json({
      message: 'Report submitted successfully',
      report
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Failed to create report', error: error.message });
  }
};

// Update report status (admin)
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const updateData = { status };
    if (adminResponse) updateData.adminResponse = adminResponse;
    if (status === 'resolved') updateData.resolvedBy = req.user.id;

    const report = await Report.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('userId', 'name phone')
      .populate('resolvedBy', 'name');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.to(report.userId._id.toString()).emit('report-updated', { report });

    res.json({ message: 'Report updated', report });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Failed to update report', error: error.message });
  }
};

// Get report stats (admin)
exports.getReportStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const inProgressReports = await Report.countDocuments({ status: 'in_progress' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });

    const reportsByType = await Report.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const reportsByDistrict = await Report.aggregate([
      { $group: { _id: '$location.district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Calculate average resolution time
    const resolvedReportsData = await Report.find({ status: 'resolved' });
    let avgResolutionTime = 0;
    if (resolvedReportsData.length > 0) {
      const totalTime = resolvedReportsData.reduce((acc, report) => {
        const resolved = new Date(report.resolvedAt || Date.now());
        const created = new Date(report.createdAt);
        return acc + (resolved - created);
      }, 0);
      avgResolutionTime = totalTime / resolvedReportsData.length / (1000 * 60 * 60); // hours
    }

    res.json({
      totalReports,
      pendingReports,
      inProgressReports,
      resolvedReports,
      reportsByType,
      reportsByDistrict,
      avgResolutionTime: avgResolutionTime.toFixed(2)
    });
  } catch (error) {
    console.error('Get report stats error:', error);
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};
