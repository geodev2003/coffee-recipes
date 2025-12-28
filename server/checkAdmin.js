require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brewvibe');
    console.log('Connected to MongoDB');

    // Check if admin exists
    const admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      console.log('\n✅ Admin user found:');
      console.log('Username:', admin.username);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Active:', admin.isActive);
    } else {
      console.log('\n❌ No admin user found!');
      console.log('Run: node seedAdmin.js to create admin user');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin:', error);
    process.exit(1);
  }
};

checkAdmin();

