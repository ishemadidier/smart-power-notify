const User = require('../models/User');

// Get all users (admin)
exports.getUsers = async (req, res) => {
  try {
    const { province, district, role, isActive, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (province) query.province = province;
    if (district) query.district = district;
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

// Get user by ID (admin)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

// Update user (admin)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, meterNumber, email, province, district, sector, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, phone, meterNumber, email, province, district, sector, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Delete/disable user (admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User disabled' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Get user stats (admin)
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'superadmin'] } });

    const usersByProvince = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$province', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const usersByDistrict = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      usersByProvince,
      usersByDistrict
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};

// Get districts by province (utility)
exports.getDistricts = async (req, res) => {
  try {
    const { province } = req.query;
    
    const districts = await User.distinct('district', province ? { province } : {});
    res.json({ districts });
  } catch (error) {
    console.error('Get districts error:', error);
    res.status(500).json({ message: 'Failed to get districts', error: error.message });
  }
};

// Get sectors by district (utility)
exports.getSectors = async (req, res) => {
  try {
    const { district } = req.query;
    
    const sectors = await User.distinct('sector', district ? { district } : {});
    res.json({ sectors });
  } catch (error) {
    console.error('Get sectors error:', error);
    res.status(500).json({ message: 'Failed to get sectors', error: error.message });
  }
};

// Update user location (for tracking current device location)
exports.updateLocation = async (req, res) => {
  try {
    // Users update their own location
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        currentLocation: {
          latitude,
          longitude,
          timestamp: new Date()
        }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Location updated', user });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Failed to update location', error: error.message });
  }
};
