const Service = require('../models/Service');
const ProviderProfile = require('../models/ProviderProfile');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get services (optional filter by providerId, category)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const { providerId, category } = req.query;
    const query = { isActive: true };

    if (providerId) {
      query.provider = providerId;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const services = await Service.find(query).sort({ price: 1 });
    return successResponse(res, 200, 'Services retrieved successfully', services);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider');
    if (!service) {
      return errorResponse(res, 404, 'Service not found');
    }
    return successResponse(res, 200, 'Service retrieved successfully', service);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (SERVICE_PROVIDER)
const createService = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    if (!provider) {
      return errorResponse(res, 403, 'No provider profile associated with this account');
    }

    const { name, description, category, price, duration, isActive } = req.body;

    if (!name || !description || price === undefined || duration === undefined) {
      return errorResponse(res, 400, 'Please provide name, description, price, and duration');
    }

    const service = await Service.create({
      provider: provider._id,
      name,
      description,
      category: category || 'General',
      price: Number(price),
      duration: Number(duration),
      isActive: isActive !== undefined ? isActive : true,
    });

    return successResponse(res, 201, 'Service created successfully', service);
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (SERVICE_PROVIDER)
const updateService = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    const service = await Service.findById(req.params.id);

    if (!service) {
      return errorResponse(res, 404, 'Service not found');
    }

    if (
      (!provider || service.provider.toString() !== provider._id.toString()) &&
      req.user.role !== 'ADMIN'
    ) {
      return errorResponse(res, 403, 'Unauthorized. You do not own this service offering');
    }

    const allowedUpdates = ['name', 'description', 'category', 'price', 'duration', 'isActive'];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    const updatedService = await service.save();
    return successResponse(res, 200, 'Service updated successfully', updatedService);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (SERVICE_PROVIDER)
const deleteService = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    const service = await Service.findById(req.params.id);

    if (!service) {
      return errorResponse(res, 404, 'Service not found');
    }

    if (
      (!provider || service.provider.toString() !== provider._id.toString()) &&
      req.user.role !== 'ADMIN'
    ) {
      return errorResponse(res, 403, 'Unauthorized. You do not own this service offering');
    }

    await service.deleteOne();
    return successResponse(res, 200, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
