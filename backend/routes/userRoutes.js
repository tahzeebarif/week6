const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/SuperAdmin
router.get('/', protect, authorize('super-admin'), async (req, res) => {
  try {
    // Select all user fields except password
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/SuperAdmin
router.put('/:id/role', protect, authorize('super-admin'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin', 'super-admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Optional: Prevent changing own role
    if (req.user.id === req.params.id) {
       return res.status(400).json({ success: false, message: 'You cannot change your own role' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;
