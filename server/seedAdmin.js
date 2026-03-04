const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-power-notify';

const adminUser = {
  name: 'Admin User || Manager',
  phone: '+250788000000',
  meterNumber: 'ADMIN001',
  email: 'admin@reg.rw',
  province: 'Kigali',
  district: 'Kigali City',
  sector: 'N/A',
  password: 'admin123',
  role: 'admin',
  isActive: true
};

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists - if so, update password
    let admin;
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      // Force reset password
      const hashedPassword = await bcrypt.hash('admin123', 12);
      admin = await User.findByIdAndUpdate(
        existingAdmin._id,
        { password: hashedPassword, isActive: true },
        { new: true }
      );
      console.log('⚠️ Admin password reset successfully!');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash(adminUser.password, 12);
      const admin = new User({
        ...adminUser,
        password: hashedPassword
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('Admin login credentials:');
      console.log('  Phone:', adminUser.phone);
      console.log('  Password:', adminUser.password);
      console.log('  Role:', adminUser.role);
    }

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
