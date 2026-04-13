const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
  console.log('Testing Cloudinary configuration...');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

  try {
    const result = await cloudinary.api.ping();
    console.log('Cloudinary Ping Result:', result);
    
    // Attempt a dummy upload if ping succeeds
    console.log('Attempting a test upload...');
    const uploadResult = await cloudinary.uploader.upload('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', {
        folder: 'test_connection'
    });
    console.log('Test Upload Result:', uploadResult.secure_url);
    
  } catch (err) {
    console.error('Cloudinary Test Failed:', err);
  }
}

testCloudinary();
