const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function resetAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI not found in .env');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const email = 'tahzeebarif3@gmail.com'; // Using the email from the user's screenshot
    const newPassword = 'Admin123!';

    let user = await User.findOne({ email });

    if (!user) {
      console.log(`User ${email} not found. Searching for any super-admin...`);
      user = await User.findOne({ role: 'super-admin' });
    }

    if (!user) {
      console.log('No Super Admin found. Creating one...');
      user = new User({
        name: 'Super Admin',
        email: email,
        password: newPassword,
        role: 'super-admin'
      });
      await user.save();
      console.log('New Super Admin created with email:', email);
    } else {
      console.log('Found user:', user.email, 'with role:', user.role);
      user.password = newPassword;
      user.role = 'super-admin'; // Ensure role is correct
      await user.save();
      console.log('Password reset successfully for:', user.email);
    }

  } catch (err) {
    console.error('Error during reset:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetAdmin();
