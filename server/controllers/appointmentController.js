const Appointment = require('../models/Appointment');
const ProviderProfile = require('../models/ProviderProfile');
const Pet = require('../models/Pet');
const Service = require('../models/Service');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (PET_OWNER)
const bookAppointment = async (req, res, next) => {
  try {
    const { providerId, serviceId, petId, date, time, reason } = req.body;

    if (!providerId || !serviceId || !petId || !date || !time) {
      return errorResponse(res, 400, 'Please provide providerId, serviceId, petId, date, and time');
    }

    // Gate 1: Provider Status Check
    const provider = await ProviderProfile.findById(providerId).populate('user', 'name email');
    if (!provider || provider.approvalStatus !== 'Approved') {
      return errorResponse(
        res,
        400,
        'Appointments can only be booked with verified and approved providers'
      );
    }

    // Gate 2: Pet Ownership Check
    const pet = await Pet.findById(petId);
    if (!pet || pet.owner.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        'Unauthorized. You can only schedule appointments for your own pets'
      );
    }

    // Gate 3: Service-Provider Link
    const service = await Service.findById(serviceId);
    if (
      !service ||
      service.provider.toString() !== provider._id.toString() ||
      !service.isActive
    ) {
      return errorResponse(res, 400, 'The requested service is not offered or currently inactive');
    }

    // Gate 4: Chronological Check (Date/Time is in future)
    const bookingDate = new Date(date);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    if (bookingDate < startOfToday) {
      return errorResponse(res, 400, 'Appointment date cannot be in the past');
    }

    // Gate 5: Double-Booking / Collision Avoidance
    // Match date by day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const existingBooking = await Appointment.findOne({
      provider: provider._id,
      date: { $gte: dayStart, $lte: dayEnd },
      time: time.trim(),
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (existingBooking) {
      return errorResponse(
        res,
        409,
        'This time slot is already reserved. Please select another slot.'
      );
    }

    // Gate 6: Server-Enforced Authoritative Price Locking
    const appointment = await Appointment.create({
      petOwner: req.user._id,
      pet: pet._id,
      provider: provider._id,
      service: service._id,
      date: bookingDate,
      time: time.trim(),
      reason: reason ? reason.trim() : 'Routine appointment',
      price: service.price, // Server authoritative price
      status: 'Pending',
    });

    // In-App Notification to Provider
    if (provider.user) {
      const dateStr = bookingDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      await Notification.create({
        user: provider.user._id,
        message: `New appointment request from ${req.user.name} for ${pet.name} on ${dateStr}, ${time}.`,
        type: 'APPOINTMENT_BOOKED',
      });
    }

    return successResponse(res, 201, 'Appointment booked successfully', appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for logged-in pet owner
// @route   GET /api/appointments/my
// @access  Private (PET_OWNER)
const getMyAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { petOwner: req.user._id };

    if (status) {
      if (status === 'Upcoming') {
        query.status = { $in: ['Pending', 'Confirmed'] };
      } else if (status === 'Cancelled') {
        query.status = { $in: ['Cancelled', 'Rejected'] };
      } else if (status !== 'All') {
        query.status = status;
      }
    }

    const appointments = await Appointment.find(query)
      .populate('pet', 'name species breed gender age image')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone' },
      })
      .populate('service', 'name price duration category')
      .sort({ date: -1, createdAt: -1 });

    return successResponse(res, 200, 'Owner appointments retrieved successfully', appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments assigned to logged-in service provider
// @route   GET /api/appointments/provider
// @access  Private (SERVICE_PROVIDER)
const getProviderAppointments = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    if (!provider) {
      return errorResponse(res, 403, 'Provider profile not found for this account');
    }

    const { status, date } = req.query;
    const query = { provider: provider._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query.date = { $gte: dayStart, $lte: dayEnd };
    }

    const appointments = await Appointment.find(query)
      .populate('petOwner', 'name email phone')
      .populate('pet', 'name species breed age medicalNotes vaccinationStatus')
      .populate('service', 'name price duration category')
      .sort({ date: 1, time: 1 });

    return successResponse(res, 200, 'Provider appointments retrieved successfully', appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Confirm, Reject, Complete, Cancel)
// @route   PATCH /api/appointments/:id/status
// @access  Private (Owner, Provider, Admin)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return errorResponse(res, 400, `Invalid status value '${status}'`);
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('petOwner', 'name email')
      .populate('pet', 'name species')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email' },
      });

    if (!appointment) {
      return errorResponse(res, 404, 'Appointment not found');
    }

    // Terminal state check
    if (['Completed', 'Rejected', 'Cancelled'].includes(appointment.status)) {
      return errorResponse(
        res,
        400,
        `Cannot change status of an appointment that is already ${appointment.status}`
      );
    }

    const isOwner = appointment.petOwner._id.toString() === req.user._id.toString();
    const isProvider =
      appointment.provider &&
      appointment.provider.user &&
      appointment.provider.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isProvider && !isAdmin) {
      return errorResponse(res, 403, 'Unauthorized to modify this appointment');
    }

    // Owner can only Cancel
    if (isOwner && !isProvider && !isAdmin) {
      if (status !== 'Cancelled') {
        return errorResponse(res, 403, 'Pet owners can only cancel their appointments');
      }
    }

    // Provider can Confirm, Reject, Complete
    if (isProvider && !isAdmin) {
      if (!['Confirmed', 'Rejected', 'Completed'].includes(status)) {
        return errorResponse(
          res,
          403,
          'Providers can only Confirm, Reject, or Complete appointments'
        );
      }
    }

    appointment.status = status;
    const updated = await appointment.save();

    // Trigger Notification
    const dateStr = new Date(appointment.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const providerName = appointment.provider?.user?.name || 'Your provider';

    if (status === 'Confirmed' && appointment.petOwner) {
      await Notification.create({
        user: appointment.petOwner._id,
        message: `${providerName} has confirmed your appointment for ${appointment.pet?.name} on ${dateStr}, ${appointment.time}.`,
        type: 'APPOINTMENT_CONFIRMED',
      });
    } else if (status === 'Rejected' && appointment.petOwner) {
      await Notification.create({
        user: appointment.petOwner._id,
        message: `${providerName} was unable to accept your appointment for ${dateStr}. Please choose another slot.`,
        type: 'APPOINTMENT_REJECTED',
      });
    } else if (status === 'Cancelled' && appointment.provider?.user) {
      await Notification.create({
        user: appointment.provider.user._id,
        message: `${appointment.petOwner.name} has cancelled the appointment for ${appointment.pet?.name} on ${dateStr}, ${appointment.time}.`,
        type: 'APPOINTMENT_CANCELLED',
      });
    } else if (status === 'Completed' && appointment.petOwner) {
      await Notification.create({
        user: appointment.petOwner._id,
        message: `Your appointment for ${appointment.pet?.name} with ${providerName} has been marked as Completed. Thank you!`,
        type: 'APPOINTMENT_COMPLETED',
      });
    }

    return successResponse(
      res,
      200,
      `Appointment status successfully updated to ${status}`,
      updated
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getProviderAppointments,
  updateAppointmentStatus,
};
