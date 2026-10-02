const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Register a new user (Pet Owner or Service Provider)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      role = 'PET_OWNER',
      // Service Provider specific fields
      providerType,
      specialization,
      experience,
      qualification,
      location,
      bio,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return errorResponse(res, 400, 'Please provide all required user registration fields');
    }

    if (confirmPassword && password !== confirmPassword) {
      return errorResponse(res, 400, 'Passwords do not match');
    }

    if (password.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters long');
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 400, 'A user with this email address already exists');
    }

    // If role is SERVICE_PROVIDER, validate provider-specific fields
    if (role === 'SERVICE_PROVIDER') {
      if (!providerType || !specialization || experience === undefined || !qualification || !location) {
        return errorResponse(
          res,
          400,
          'Service providers must provide providerType, specialization, experience, qualification, and location'
        );
      }
    }

    // Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      isActive: true,
    });

    let providerProfile = null;

    // Create linked ProviderProfile if provider
    if (role === 'SERVICE_PROVIDER') {
      providerProfile = await ProviderProfile.create({
        user: user._id,
        providerType,
        specialization,
        experience: Number(experience) || 0,
        qualification,
        location,
        bio: bio || '',
        approvalStatus: 'Pending',
        rating: 5.0,
      });
    }

    const token = generateToken(user._id);

    return successResponse(res, 201, 'Registration successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        ...(providerProfile && { providerProfile }),
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide both email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      return errorResponse(
        res,
        403,
        'Your account has been deactivated. Please contact platform administration.'
      );
    }

    let providerProfile = null;
    if (user.role === 'SERVICE_PROVIDER') {
      providerProfile = await ProviderProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    return successResponse(res, 200, 'Login successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        ...(providerProfile && { providerProfile }),
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    let providerProfile = null;
    if (user.role === 'SERVICE_PROVIDER') {
      providerProfile = await ProviderProfile.findOne({ user: user._id });
    }

    return successResponse(res, 200, 'User profile retrieved successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      ...(providerProfile && { providerProfile }),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, phone)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    const updatedUser = await user.save();

    return successResponse(res, 200, 'Profile updated successfully', {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 400, 'Please provide both current and new password');
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 400, 'New password must be at least 6 characters long');
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 400, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
