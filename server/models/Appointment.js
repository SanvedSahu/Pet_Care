const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    petOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must reference a pet owner'],
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Appointment must reference a pet'],
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProviderProfile',
      required: [true, 'Appointment must reference a provider profile'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Appointment must reference a service'],
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    time: {
      type: String,
      required: [true, 'Appointment time slot is required'],
      trim: true, // Example: "10:00 AM", "02:30 PM"
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
      default: 'Routine consultation / appointment',
    },
    price: {
      type: Number,
      required: [true, 'Appointment price is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
        message: '{VALUE} is not a valid appointment status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
appointmentSchema.index({ provider: 1, date: 1, time: 1 });
appointmentSchema.index({ petOwner: 1, status: 1 });
appointmentSchema.index({ provider: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
