const ProviderProfile = require('../models/ProviderProfile');
const Service = require('../models/Service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Browse public marketplace of approved providers
// @route   GET /api/providers
// @access  Public
const getPublicProviders = async (req, res, next) => {
  try {
    const { type, location, search, minRating } = req.query;

    const query = { approvalStatus: 'Approved' };

    if (type && type !== 'All') {
      query.providerType = type;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    let providers = await ProviderProfile.find(query)
      .populate('user', 'name email phone')
      .sort({ rating: -1, experience: -1 });

    if (search) {
      const searchLower = search.toLowerCase();
      providers = providers.filter(
        (p) =>
          (p.user && p.user.name && p.user.name.toLowerCase().includes(searchLower)) ||
          p.specialization.toLowerCase().includes(searchLower) ||
          p.location.toLowerCase().includes(searchLower) ||
          p.providerType.toLowerCase().includes(searchLower)
      );
    }

    // Attach active services and starting price
    const providerIds = providers.map((p) => p._id);
    const services = await Service.find({ provider: { $in: providerIds }, isActive: true });

    const providersWithDetails = providers.map((p) => {
      const pObj = p.toObject();
      const pServices = services.filter(
        (s) => s.provider.toString() === p._id.toString()
      );
      pObj.services = pServices;
      pObj.startingPrice =
        pServices.length > 0 ? Math.min(...pServices.map((s) => s.price)) : 0;
      return pObj;
    });

    return successResponse(
      res,
      200,
      'Approved providers retrieved successfully',
      providersWithDetails
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed provider profile by ID
// @route   GET /api/providers/:id
// @access  Public
const getProviderById = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findById(req.params.id).populate(
      'user',
      'name email phone'
    );

    if (!provider) {
      return errorResponse(res, 404, 'Provider not found');
    }

    const services = await Service.find({ provider: provider._id, isActive: true });

    const providerObj = provider.toObject();
    providerObj.services = services;
    providerObj.startingPrice =
      services.length > 0 ? Math.min(...services.map((s) => s.price)) : 0;

    return successResponse(res, 200, 'Provider details retrieved successfully', providerObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in provider's profile
// @route   GET /api/providers/me
// @access  Private (SERVICE_PROVIDER)
const getMyProviderProfile = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone role isActive'
    );

    if (!provider) {
      return errorResponse(res, 404, 'Provider profile not found for this account');
    }

    const services = await Service.find({ provider: provider._id });

    const providerObj = provider.toObject();
    providerObj.services = services;

    return successResponse(res, 200, 'Provider profile retrieved successfully', providerObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Update current provider's profile
// @route   PUT /api/providers/me
// @access  Private (SERVICE_PROVIDER)
const updateMyProviderProfile = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    if (!provider) {
      return errorResponse(res, 404, 'Provider profile not found');
    }

    const allowedUpdates = [
      'specialization',
      'bio',
      'location',
      'experience',
      'qualification',
      'providerType',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        provider[field] = req.body[field];
      }
    });

    const updated = await provider.save();
    return successResponse(res, 200, 'Provider profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicProviders,
  getProviderById,
  getMyProviderProfile,
  updateMyProviderProfile,
};
