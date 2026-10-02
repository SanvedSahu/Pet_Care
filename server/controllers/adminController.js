const User = require('../models/User');
const Pet = require('../models/Pet');
const ProviderProfile = require('../models/ProviderProfile');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get executive platform dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private (ADMIN)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPetOwners,
      totalProviders,
      pendingProviders,
      approvedProviders,
      suspendedProviders,
      totalPets,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      recentAppointments,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'PET_OWNER' }),
      ProviderProfile.countDocuments(),
      ProviderProfile.countDocuments({ approvalStatus: 'Pending' }),
      ProviderProfile.countDocuments({ approvalStatus: 'Approved' }),
      ProviderProfile.countDocuments({ approvalStatus: 'Suspended' }),
      Pet.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Pending' }),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.find()
        .populate('petOwner', 'name email')
        .populate('pet', 'name species')
        .populate({
          path: 'provider',
          populate: { path: 'user', select: 'name email' },
        })
        .populate('service', 'name price')
        .sort({ createdAt: -1 })
        .limit(5),
      User.find().select('-password').sort({ createdAt: -1 }).limit(5),
    ]);

    return successResponse(res, 200, 'Dashboard metrics retrieved successfully', {
      totalUsers,
      totalPetOwners,
      totalProviders,
      pendingProviders,
      approvedProviders,
      suspendedProviders,
      totalPets,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      recentAppointments,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all providers with optional status filtering
// @route   GET /api/admin/providers
// @access  Private (ADMIN)
const getAllProviders = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.approvalStatus = status;
    }

    if (type && type !== 'All') {
      query.providerType = type;
    }

    let providers = await ProviderProfile.find(query)
      .populate('user', 'name email phone isActive createdAt')
      .sort({ createdAt: -1 });

    // Filter by name or email or location if search string provided
    if (search) {
      const searchLower = search.toLowerCase();
      providers = providers.filter(
        (p) =>
          (p.user && p.user.name && p.user.name.toLowerCase().includes(searchLower)) ||
          (p.user && p.user.email && p.user.email.toLowerCase().includes(searchLower)) ||
          (p.location && p.location.toLowerCase().includes(searchLower)) ||
          (p.specialization && p.specialization.toLowerCase().includes(searchLower))
      );
    }

    // Attach count of services
    const providerIds = providers.map((p) => p._id);
    const services = await Service.find({ provider: { $in: providerIds } });

    const providersWithServices = providers.map((p) => {
      const pObj = p.toObject();
      pObj.servicesCount = services.filter(
        (s) => s.provider.toString() === p._id.toString()
      ).length;
      return pObj;
    });

    return successResponse(res, 200, 'Providers retrieved successfully', providersWithServices);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve provider profile
// @route   PATCH /api/admin/providers/:id/approve
// @access  Private (ADMIN)
const approveProvider = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findById(req.params.id).populate('user', 'name email');
    if (!provider) {
      return errorResponse(res, 404, 'Provider profile not found');
    }

    provider.approvalStatus = 'Approved';
    await provider.save();

    // Send in-app notification to provider
    if (provider.user) {
      await Notification.create({
        user: provider.user._id,
        message: 'Congratulations! Your PetCare provider application has been approved. Your profile is now live on the public marketplace.',
        type: 'PROVIDER_APPROVED',
      });
    }

    return successResponse(res, 200, `Provider '${provider.user?.name || provider.specialization}' approved successfully`, provider);
  } catch (error) {
    next(error);
  }
};

// @desc    Reject provider profile
// @route   PATCH /api/admin/providers/:id/reject
// @access  Private (ADMIN)
const rejectProvider = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findById(req.params.id).populate('user', 'name email');
    if (!provider) {
      return errorResponse(res, 404, 'Provider profile not found');
    }

    provider.approvalStatus = 'Rejected';
    await provider.save();

    // Send in-app notification to provider
    if (provider.user) {
      await Notification.create({
        user: provider.user._id,
        message: 'Your PetCare provider application could not be verified and was rejected. Please review credential details and contact support.',
        type: 'PROVIDER_REJECTED',
      });
    }

    return successResponse(res, 200, `Provider '${provider.user?.name || provider.specialization}' rejected`, provider);
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend provider profile
// @route   PATCH /api/admin/providers/:id/suspend
// @access  Private (ADMIN)
const suspendProvider = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findById(req.params.id).populate('user', 'name email');
    if (!provider) {
      return errorResponse(res, 404, 'Provider profile not found');
    }

    provider.approvalStatus = 'Suspended';
    await provider.save();

    return successResponse(res, 200, `Provider '${provider.user?.name || provider.specialization}' account suspended`, provider);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with role filtering & search
// @route   GET /api/admin/users
// @access  Private (ADMIN)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, status } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (status !== undefined && status !== 'All') {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    return successResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/inactive status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (ADMIN)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Prevent admin from deactivating their own account
    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 400, 'Administrators cannot deactivate their own account');
    }

    if (req.body.isActive !== undefined) {
      user.isActive = Boolean(req.body.isActive);
    } else {
      user.isActive = !user.isActive;
    }

    await user.save();

    return successResponse(
      res,
      200,
      `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform-wide appointment audit list
// @route   GET /api/admin/appointments
// @access  Private (ADMIN)
const getAllAppointments = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('petOwner', 'name email phone')
      .populate('pet', 'name species breed age')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone' },
      })
      .populate('service', 'name price duration category')
      .sort({ createdAt: -1 });

    let filtered = appointments;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = appointments.filter(
        (a) =>
          (a.petOwner && a.petOwner.name && a.petOwner.name.toLowerCase().includes(searchLower)) ||
          (a.pet && a.pet.name && a.pet.name.toLowerCase().includes(searchLower)) ||
          (a.provider && a.provider.user && a.provider.user.name && a.provider.user.name.toLowerCase().includes(searchLower)) ||
          (a.service && a.service.name && a.service.name.toLowerCase().includes(searchLower))
      );
    }

    return successResponse(res, 200, 'Appointments retrieved successfully', filtered);
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform-wide pet catalog
// @route   GET /api/admin/pets
// @access  Private (ADMIN)
const getAllPets = async (req, res, next) => {
  try {
    const { species, search } = req.query;
    const query = {};

    if (species && species !== 'All') {
      query.species = species;
    }

    let pets = await Pet.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    if (search) {
      const searchLower = search.toLowerCase();
      pets = pets.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          (p.breed && p.breed.toLowerCase().includes(searchLower)) ||
          (p.owner && p.owner.name && p.owner.name.toLowerCase().includes(searchLower))
      );
    }

    return successResponse(res, 200, 'Pets retrieved successfully', pets);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllProviders,
  approveProvider,
  rejectProvider,
  suspendProvider,
  getAllUsers,
  toggleUserStatus,
  getAllAppointments,
  getAllPets,
};
